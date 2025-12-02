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
      
      // The key fix: Don't pass extraction path to executablePath()
      // Let it use its default behavior which should handle the brotli files automatically
      // If brotli files aren't available, it will download Chromium
      let executablePath: string;
      
      try {
        // First, try without specifying extraction path
        // This allows the package to find its brotli files in node_modules
        executablePath = await Chromium.executablePath();
        console.log('Chromium executable path (default):', executablePath);
      } catch (error) {
        console.warn('Default Chromium path failed, trying with /tmp:', error);
        // Fallback: try with /tmp extraction path
        try {
          executablePath = await Chromium.executablePath('/tmp/chromium');
          console.log('Chromium executable path (/tmp):', executablePath);
        } catch (fallbackError) {
          console.error('All Chromium path attempts failed');
          throw new Error(
            `Failed to get Chromium executable. ` +
            `The @sparticuz/chromium package may not be properly installed or its files may not be included in deployment. ` +
            `Please ensure the package is in dependencies and not excluded from deployment. ` +
            `Error: ${error instanceof Error ? error.message : String(error)}`
          );
        }
      }
      
      if (!executablePath) {
        throw new Error('Chromium executable path is null or undefined');
      }
      
      console.log('Launching browser with executable:', executablePath);
      
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

