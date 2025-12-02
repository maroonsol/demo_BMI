// This file is server-only and should not be imported in client components
// Use the API route /api/generate-pdf instead
import 'server-only';

export interface HealthData {
  name: string;
  date: string;
  age: number;
  gender: 'male' | 'female';
  height: number;
  phone: string;
  email: string;
  weight: number;
  bodyFat: number;
  visceralFat: number;
  bmr: number;
  bmi: number;
  bodyAge: number;
  subcutaneousFat: number;
  skeletalMuscle: number;
}

export function getBMICategory(bmi: number): { category: string; details: string; color: string } {
  if (bmi < 18) {
    return {
      category: 'Malnutrition 2',
      details: 'Anorexia, Bulimia, Osteoporosis and Break Down of Muscle mass etc.',
      color: '#ef4444' // red
    };
  } else if (bmi >= 18 && bmi < 20) {
    return {
      category: 'Malnutrition 1',
      details: 'Anorexia, Bulimia, Osteoporosis and Break Down of Muscle mass etc.',
      color: '#f97316' // orange
    };
  } else if (bmi >= 20 && bmi < 23) {
    return {
      category: 'Normal',
      details: 'Normal mensuration, can handle stress, good energy levels, vitality, resistance to illness, good physical condition etc.',
      color: '#22c55e' // green
    };
  } else if (bmi >= 23 && bmi < 25) {
    return {
      category: 'Overweight',
      details: 'Fatigue, digestive problems, circulation problems, varicose veins etc.',
      color: '#f97316' // orange
    };
  } else if (bmi >= 25 && bmi < 28) {
    return {
      category: 'Obesity grade 1',
      details: 'Diabetes, hypertension, cardiovascular diseases, blood clots, stroke, joint problems/arthritis in knee, spine etc.',
      color: '#f97316' // orange
    };
  } else if (bmi >= 28 && bmi < 30) {
    return {
      category: 'Obesity grade 2',
      details: 'Diabetes, cancer, angina, heart attacks, arteriolosclerosis & strokes etc.',
      color: '#ef4444' // red
    };
  } else {
    return {
      category: 'Obesity grade 3',
      details: 'Maximum risk of diabetes, cancer, heart disease.',
      color: '#ef4444' // red
    };
  }
}

export function getBodyFatStatus(bodyFat: number, gender: 'male' | 'female'): { status: string; color: string } {
  if (gender === 'male') {
    if (bodyFat >= 10 && bodyFat <= 20) {
      return { status: 'Normal', color: '#22c55e' };
    } else if (bodyFat >= 21 && bodyFat <= 25) {
      return { status: 'High', color: '#f97316' };
    } else {
      return { status: 'Risk', color: '#ef4444' };
    }
  } else {
    if (bodyFat >= 20 && bodyFat <= 30) {
      return { status: 'Normal', color: '#22c55e' };
    } else if (bodyFat >= 31 && bodyFat <= 35) {
      return { status: 'High', color: '#f97316' };
    } else {
      return { status: 'Risk', color: '#ef4444' };
    }
  }
}

export function getVisceralFatStatus(visceralFat: number): { status: string; color: string } {
  if (visceralFat >= 2 && visceralFat <= 8) {
    return { status: 'Normal', color: '#22c55e' };
  } else if (visceralFat >= 9 && visceralFat <= 14) {
    return { status: 'High', color: '#f97316' };
  } else {
    return { status: 'Risk', color: '#ef4444' };
  }
}

export function getSubcutaneousFatStatus(subcutaneousFat: number): { status: string; color: string } {
  if (subcutaneousFat < 15) {
    return { status: 'Normal', color: '#22c55e' };
  } else {
    return { status: 'High', color: '#f97316' };
  }
}

export function getSkeletalMuscleStatus(skeletalMuscle: number, gender: 'male' | 'female'): { status: string; color: string } {
  if (gender === 'male') {
    if (skeletalMuscle >= 33 && skeletalMuscle <= 36) {
      return { status: 'Normal', color: '#22c55e' };
    } else {
      return { status: 'Abnormal', color: '#f97316' };
    }
  } else {
    if (skeletalMuscle >= 30 && skeletalMuscle <= 33) {
      return { status: 'Normal', color: '#22c55e' };
    } else {
      return { status: 'Abnormal', color: '#f97316' };
    }
  }
}

export function getBMRStatus(bmr: number, gender: 'male' | 'female'): { status: string; color: string } {
  const expectedBMR = gender === 'male' ? 1800 : 1600;
  const diff = Math.abs(bmr - expectedBMR);
  const percentage = (diff / expectedBMR) * 100;
  
  if (percentage <= 10) {
    return { status: 'Normal', color: '#22c55e' };
  } else if (percentage <= 20) {
    return { status: 'Slightly Abnormal', color: '#f97316' };
  } else {
    return { status: 'Abnormal', color: '#ef4444' };
  }
}

/**
 * Generates PDF using Puppeteer with HTML/CSS template
 */
export async function generatePDF(data: HealthData): Promise<Uint8Array> {
  // Get status information
  const bmiCategory = getBMICategory(data.bmi);
  const bodyFatStatus = getBodyFatStatus(data.bodyFat, data.gender);
  const visceralFatStatus = getVisceralFatStatus(data.visceralFat);
  const subcutaneousFatStatus = getSubcutaneousFatStatus(data.subcutaneousFat);
  const skeletalMuscleStatus = getSkeletalMuscleStatus(data.skeletalMuscle, data.gender);
  const bmrStatus = getBMRStatus(data.bmr, data.gender);

  // Format report date
  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Prepare metrics data
  const metrics = [
    {
      name: "BMI (Body Mass Index)",
      value: data.bmi.toFixed(1),
      status: bmiCategory.category,
      color: bmiCategory.color,
      details: bmiCategory.details,
      isBMI: true,
    },
    {
      name: "Body Fat (%)",
      value: `${data.bodyFat}%`,
      status: bodyFatStatus.status,
      color: bodyFatStatus.color,
      details: `Normal Range: ${data.gender === 'male' ? '10-20%' : '20-30%'} | High: ${data.gender === 'male' ? '21-25%' : '31-35%'} | Risk: ${data.gender === 'male' ? '25%+' : '35%+'}`,
    },
    {
      name: "Visceral Fat",
      value: data.visceralFat.toString(),
      status: visceralFatStatus.status,
      color: visceralFatStatus.color,
      details: "Normal: 2-8 | High: 9-14 | Risk: 15+",
    },
    {
      name: "Subcutaneous Fat (%)",
      value: `${data.subcutaneousFat}%`,
      status: subcutaneousFatStatus.status,
      color: subcutaneousFatStatus.color,
      details: "Fat found just below the skin. Ideal range: < 15%",
    },
    {
      name: "Skeletal Muscle (%)",
      value: `${data.skeletalMuscle}%`,
      status: skeletalMuscleStatus.status,
      color: skeletalMuscleStatus.color,
      details: `Normal Range: ${data.gender === 'male' ? '33-36%' : '30-33%'}`,
    },
    {
      name: "BMR (Basal Metabolic Rate)",
      value: data.bmr.toString(),
      status: bmrStatus.status,
      color: bmrStatus.color,
      details: `Expected Range: ${data.gender === 'male' ? '~1800 kcal/day' : '~1600 kcal/day'}`,
    },
    {
      name: "Body Age",
      value: data.bodyAge.toString(),
      status: data.bodyAge <= data.age ? 'Good' : 'Needs Improvement',
      color: data.bodyAge <= data.age ? '#22c55e' : '#f97316',
      details: `Your body age compared to your chronological age of ${data.age} years`,
    },
  ];

  // Create HTML content
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          @page {
            margin: 0;
            size: A4;
          }
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: Arial, sans-serif;
            padding: 15mm;
            color: #0f172a;
            background: #fff;
          }
          .header {
            background: #2563eb;
            color: white;
            padding: 15px 20px;
            border-radius: 4px;
            margin-bottom: 20px;
            text-align: center;
          }
          .header h1 {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 8px;
          }
          .header p {
            font-size: 10px;
            line-height: 1.4;
            margin: 2px 0;
          }
          .report-title {
            text-align: center;
            font-size: 22px;
            font-weight: bold;
            color: #0f172a;
            margin-bottom: 20px;
          }
          .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #0f172a;
            margin: 20px 0 10px 0;
            display: flex;
            align-items: center;
          }
          .section-title::before {
            content: '';
            width: 5px;
            height: 20px;
            background: #2563eb;
            margin-right: 8px;
          }
          .patient-info-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            padding: 15px;
            margin-bottom: 20px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-top: 10px;
          }
          .info-item {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 3px;
            padding: 8px 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .info-label {
            color: #475569;
            font-size: 10px;
          }
          .info-value {
            color: #0f172a;
            font-weight: bold;
            font-size: 10px;
            text-align: right;
          }
          .metrics-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 20px;
          }
          .metric-card {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            padding: 12px;
            position: relative;
            min-height: 120px;
          }
          .metric-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1.5px;
            background: #2563eb;
          }
          .metric-name {
            font-size: 11px;
            font-weight: bold;
            color: #334155;
            margin-bottom: 8px;
          }
          .metric-value {
            font-size: 18px;
            font-weight: bold;
            text-align: right;
            margin-bottom: 5px;
          }
          .metric-status {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 8px;
            font-weight: bold;
            text-transform: uppercase;
            float: right;
          }
          .metric-details {
            font-size: 9px;
            color: #64748b;
            margin-top: 8px;
            line-height: 1.3;
          }
          .bmi-details-box {
            background: #fef3c7;
            border: 1px solid #fef3c7;
            border-left: 3px solid;
            border-radius: 3px;
            padding: 8px;
            margin-top: 8px;
            font-size: 9px;
            font-weight: bold;
            color: #334155;
          }
          .basic-measurements {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 20px;
          }
          .measurement-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            padding: 15px;
            text-align: center;
          }
          .measurement-label {
            font-size: 10px;
            font-weight: bold;
            color: #64748b;
            margin-bottom: 8px;
          }
          .measurement-value {
            font-size: 20px;
            font-weight: bold;
            color: #0f172a;
          }
          .footer {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            padding: 15px;
            text-align: center;
            margin-top: 30px;
          }
          .footer p {
            font-size: 10px;
            color: #64748b;
            margin: 5px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Health Assessment Center</h1>
          <p>123 Medical Street, Health City, HC 12345</p>
          <p>Phone: +1 (555) 123-4567 | Email: info@healthassessment.com</p>
          <p>Website: www.healthassessment.com</p>
        </div>

        <div class="report-title">Health Assessment Report</div>

        <div class="section-title">Patient Information</div>
        <div class="patient-info-box">
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Name:</span>
              <span class="info-value">${data.name}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Date:</span>
              <span class="info-value">${data.date}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Age:</span>
              <span class="info-value">${data.age} years</span>
            </div>
            <div class="info-item">
              <span class="info-label">Gender:</span>
              <span class="info-value">${data.gender.charAt(0).toUpperCase() + data.gender.slice(1)}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Phone:</span>
              <span class="info-value">${data.phone}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Email:</span>
              <span class="info-value">${data.email}</span>
            </div>
          </div>
        </div>

        <div class="section-title">Body Composition Analysis</div>
        <div class="metrics-grid">
          ${metrics.map(metric => `
            <div class="metric-card">
              <div class="metric-name">${metric.name}</div>
              <div class="metric-value" style="color: ${metric.color};">${metric.value}</div>
              <span class="metric-status" style="background: ${metric.color}20; color: ${metric.color};">
                ${metric.status.toUpperCase()}
              </span>
              <div class="metric-details">${metric.details}</div>
              ${metric.isBMI ? `
                <div class="bmi-details-box" style="border-left-color: ${metric.color};">
                  Details: ${metric.details}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>

        <div class="section-title">Basic Measurements</div>
        <div class="basic-measurements">
          <div class="measurement-card">
            <div class="measurement-label">HEIGHT</div>
            <div class="measurement-value">${data.height} cm</div>
          </div>
          <div class="measurement-card">
            <div class="measurement-label">WEIGHT</div>
            <div class="measurement-value">${data.weight} kg</div>
          </div>
        </div>

        <div class="footer">
          <p>Report Generated: ${reportDate}</p>
          <p>For any queries, please contact us at info@healthassessment.com</p>
        </div>
      </body>
    </html>
  `;

  // Generate PDF using Puppeteer
  // Check if we're in a serverless environment (Vercel)
  const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV;
  
  let browser;
  
  if (isVercel) {
    // Use @sparticuz/chromium for Vercel deployment
    const puppeteer = await import('puppeteer-core');
    const chromiumModule = await import('@sparticuz/chromium');
    const Chromium = chromiumModule.default;
    
    const executablePath: string = await Chromium.executablePath();
    browser = await puppeteer.launch({
      args: Chromium.args,
      executablePath,
      headless: true,
    });
  } else {
    // For local development, use regular puppeteer (which includes Chromium)
    try {
      const puppeteerFull = await import('puppeteer');
      browser = await puppeteerFull.default.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    } catch (error) {
      // Fallback: try puppeteer-core with system Chrome
      const puppeteer = await import('puppeteer-core');
      const fs = await import('fs');
      
      const possiblePaths: (string | undefined)[] = [
        process.env.PUPPETEER_EXECUTABLE_PATH,
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        process.env.CHROME_PATH,
      ].filter((path): path is string => typeof path === 'string' && path.length > 0);

      let executablePath: string | undefined;
      for (const path of possiblePaths) {
        if (path && fs.existsSync(path)) {
          executablePath = path;
          break;
        }
      }

      if (!executablePath) {
        throw new Error(
          'Chromium executable not found. For local development, please:\n' +
          '1. Install puppeteer: npm install puppeteer\n' +
          '2. Or set PUPPETEER_EXECUTABLE_PATH to your Chrome/Chromium path\n' +
          '3. Or install Chrome browser'
        );
      }

      browser = await puppeteer.launch({
        executablePath,
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    }
  }

  const page = await browser.newPage();
  await page.setContent(htmlContent, {
    waitUntil: 'networkidle0'
  });

  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: {
      top: '15mm',
      right: '15mm',
      bottom: '15mm',
      left: '15mm'
    }
  });

  await browser.close();

  return pdf;
}
