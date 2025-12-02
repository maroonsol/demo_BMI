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
      
      const executablePath = await Chromium.executablePath();
      
      if (!executablePath) {
        throw new Error('Chromium executable path not found');
      }
      
      browser = await puppeteer.launch({
        args: [
          ...Chromium.args,
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-setuid-sandbox',
          '--no-sandbox',
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

