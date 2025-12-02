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

    // Use puppeteer-core with @sparticuz/chromium for both dev and production
    const puppeteer = await import('puppeteer-core');
    const chromiumModule = await import('@sparticuz/chromium');
    const Chromium = chromiumModule.default;
    const executablePath: string = await Chromium.executablePath();
    
    const browser = await puppeteer.launch({
      args: Chromium.args,
      executablePath,
      headless: true,
    });

    try {
      // Create a new page
      const page = await browser.newPage();

      // Set the content of the page
      await page.setContent(fullHTML, {
        waitUntil: 'networkidle0'
      });

      // Generate PDF
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0',
          right: '0',
          bottom: '0',
          left: '0'
        }
      });

      // Close the browser
      await browser.close();

      // Return PDF as response
      return new NextResponse(Buffer.from(pdf), {
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

