// src/app/api/parse-job/route.js
import { uploadJobDescriptionPDF } from '@/lib/storage';
import { uploadJobDescriptionPDFAdmin } from '@/lib/storage-admin'; // ← Use admin version
import { NextResponse } from 'next/server';

// Mock data generator
function generateMockJobData(jobTitle, jdText) {
  const locations = ['Remote', 'New York, NY', 'San Francisco, CA', 'Austin, TX', 'London, UK'];
  const companies = ['TechCorp', 'InnovateLabs', 'DataSystems', 'CloudSolutions', 'NextGen Tech'];
  const skills = ['React', 'Node.js', 'Python', 'AWS', 'TypeScript', 'MongoDB', 'PostgreSQL'];

  // Extract some skills from JD text if provided
  let extractedSkills = [];
  if (jdText) {
    const normalizedText = jdText.toLowerCase().replace(/[^\w\s]/g, ' ');
    extractedSkills = skills.filter(skill =>
      normalizedText.includes(skill.toLowerCase())
    );
  }


  return {
    location: locations[Math.floor(Math.random() * locations.length)],
    employmentType: ['full_time', 'part_time', 'internship'][Math.floor(Math.random() * 3)],
    workMode: ['remote', 'hybrid', 'onsite'][Math.floor(Math.random() * 3)],
    companyName: companies[Math.floor(Math.random() * companies.length)],
    skillsRequired: extractedSkills.length > 0 ? extractedSkills : skills.slice(0, 3),
    jdSummary: jdText
      ? `Summary: ${jdText.substring(0, 200)}...`
      : 'Job description summary will appear here'
  };
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const jobTitle = formData.get('jobTitle');
    const jdFile = formData.get('jdFile');
    const jdText = formData.get('jdText');
    const userId = formData.get('userId'); // ← We'll need to send this from frontend

    let jdContent = jdText;
    let jdPdfUrl = null;

    // // If file was uploaded, simulate text extraction
    // if (jdFile && jdFile instanceof File) {
    //   jdContent = `Extracted text from ${jdFile.name}: This is a simulated text extraction from the uploaded JD file. The position requires strong technical skills and experience.`;
    // }

    // If file was uploaded, upload to Firebase Storage
    if (jdFile && jdFile instanceof File) {
      try {
        // Convert File to Buffer for server-side processing
        const arrayBuffer = await jdFile.arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);

        // Create unique file name
        const timestamp = Date.now();
        const fileName = `jd_${timestamp}_${jdFile.name.replace(/\s+/g, '_')}`;

        // Upload PDF to Firebase Storage using Admin SDK
        jdPdfUrl = await uploadJobDescriptionPDFAdmin(fileBuffer, fileName, userId);

        // For mock data, we'll still use some extracted text
        jdContent = `PDF uploaded: ${jdFile.name}. ${jdText || 'Extracted text simulation...'}`;
      } catch (uploadError) {
        console.error('File upload failed:', uploadError);
        // Continue without the file URL
        jdContent = `Failed to upload PDF. Using file name: ${jdFile.name}. ${jdText || ''}`;
      }
    }

    // Simulate API processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const parsedData = generateMockJobData(jobTitle, jdContent);

    return NextResponse.json({
      success: true,
      data: parsedData,
      rawText: jdContent,
      jdPdfUrl: jdPdfUrl // ← Return the storage URL
    });

  } catch (error) {
    console.error('Error parsing job:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to parse job description' },
      { status: 500 }
    );
  }
}