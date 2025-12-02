import { NextRequest, NextResponse } from 'next/server';
import { generateReportHTML, type HealthData } from '@/lib/pdf-generator';

export async function POST(request: NextRequest) {
  try {
    const data: HealthData = await request.json();

    // Validate required fields
    if (!data.name || !data.date || !data.age) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Detect environment - use puppeteer for local dev, puppeteer-core for production
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;
    
    let browser;
    
    if (isProduction) {
      // Production/serverless: use puppeteer-core with @sparticuz/chromium
      const puppeteer = await import('puppeteer-core');
      const chromiumModule = await import('@sparticuz/chromium');
      const Chromium = chromiumModule.default;
      
      // For Vercel/Lambda, use /tmp as the extraction directory (writable in serverless)
      // The executablePath function will extract the Chromium binary from brotli files
      const extractionPath = '/tmp/chromium';
      
      let executablePath: string;
      try {
        // Get executable path - this will extract Chromium if needed
        // The package should automatically find its brotli files in node_modules
        executablePath = await Chromium.executablePath(extractionPath);
      } catch (error) {
        console.error('Error getting Chromium executable path with extraction path:', error);
        // Fallback: try without specifying extraction path (uses default /tmp location)
        try {
          executablePath = await Chromium.executablePath();
        } catch (fallbackError) {
          console.error('Fallback Chromium path also failed:', fallbackError);
          // Last resort: provide more context in error
          const errorMessage = error instanceof Error ? error.message : String(error);
          const fallbackMessage = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
          throw new Error(
            `Failed to get Chromium executable. First attempt: ${errorMessage}. Fallback: ${fallbackMessage}. ` +
            `Make sure @sparticuz/chromium package files are included in deployment.`
          );
        }
      }
      
      if (!executablePath) {
        throw new Error('Chromium executable path not found');
      }
      
      console.log('Chromium executable path:', executablePath);
      
      browser = await puppeteer.launch({
        args: [
          ...Chromium.args,
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-setuid-sandbox',
          '--no-sandbox',
          '--single-process',
        ],
        executablePath,
        headless: true,
        defaultViewport: {
          width: 1920,
          height: 1080,
        },
      });
    } else {
      // Local development: use puppeteer (includes bundled Chromium)
      const puppeteer = await import('puppeteer');
      
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--no-sandbox',
        ],
        defaultViewport: {
          width: 1920,
          height: 1080,
        },
      });
    }

    try {
      const page = await browser.newPage();
      
      // Generate HTML content
      const htmlContent = generateReportHTML(data);
      
      // Create a complete HTML document
      const fullHTML = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body {
                margin: 0;
                padding: 0;
              }
            </style>
          </head>
          <body>
            ${htmlContent}
          </body>
        </html>
      `;

      // Set content and wait for rendering
      await page.setContent(fullHTML, {
        waitUntil: 'networkidle0',
      });

      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0',
          right: '0',
          bottom: '0',
          left: '0',
        },
      });

      // Close browser
      await browser.close();

      // Return PDF as response
      return new NextResponse(Buffer.from(pdfBuffer), {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="Health_Report_${data.name.replace(/\s+/g, '_')}_${data.date.replace(/\s+/g, '_')}.pdf"`,
        },
      });
    } catch (error) {
      await browser.close();
      throw error;
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

