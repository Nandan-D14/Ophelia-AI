// Quick test for Gemini API integration with correct model names
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'YOUR_API_KEY_HERE';

async function testGeminiAPI() {
  console.log('🔬 Testing Gemini 2.5 Flash Integration...');
  
  try {
    // Test basic content generation with correct model name
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: 'Generate a creative description for a handcrafted pottery bowl' }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Gemini API Error:', response.status, errorData.error?.message || response.statusText);
      return false;
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (content) {
      console.log('✅ Gemini 2.5 Flash Response:', content);
      return true;
    } else {
      console.log('❌ No content generated');
      return false;
    }
  } catch (error) {
    console.error('❌ Network Error:', error);
    return false;
  }
}

async function testGeminiPro() {
  console.log('🔬 Testing Gemini 2.5 Pro Integration...');
  
  try {
    // Test with the Pro model for better quality
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: 'Generate a creative description for a handcrafted pottery bowl' }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Gemini Pro API Error:', response.status, errorData.error?.message || response.statusText);
      return false;
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (content) {
      console.log('✅ Gemini 2.5 Pro Response:', content);
      return true;
    } else {
      console.log('❌ No content generated');
      return false;
    }
  } catch (error) {
    console.error('❌ Network Error:', error);
    return false;
  }
}

async function testContentGeneration() {
  console.log('📝 Testing AI Content Generation (Product Description)...');
  
  try {
    // Test content generation for Creative Studio
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: 'As an expert copywriter for handmade artisan products, create a compelling product description for a Handwoven Silk Scarf. Category: Fashion. Materials: silk. Techniques: traditional craftsmanship. Write a 3-paragraph description that captures the unique qualities, highlights the cultural significance, and appeals to customers who value authentic, handmade goods. Keep it engaging, authentic, and under 150 words.' }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Content Generation Error:', response.status, errorData.error?.message || response.statusText);
      return false;
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (content) {
      console.log('✅ Content Generated Successfully:');
      console.log(content);
      return true;
    } else {
      console.log('❌ No content generated');
      return false;
    }
  } catch (error) {
    console.error('❌ Network Error:', error);
    return false;
  }
}

async function testCreativeStudioContent() {
  console.log('🎨 Testing Creative Studio Content Generation...');
  
  try {
    // Test AI Content Generator for Creative Studio
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: 'Create a social media caption for a Handwoven Silk Scarf fashion product. Write it in a professional and informative tone. Include: 1. An attention-grabbing hook 2. Product highlights 3. Call-to-action Keep it under 150 characters with relevant hashtags.' }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Creative Studio Content Error:', response.status, errorData.error?.message || response.statusText);
      return false;
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (content) {
      console.log('✅ Creative Studio Content Generated:');
      console.log(content);
      return true;
    } else {
      console.log('❌ No content generated');
      return false;
    }
  } catch (error) {
    console.error('❌ Network Error:', error);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting Comprehensive Gemini API Tests for Creative Studio...\n');
  
  const results = {
    geminiFlash: await testGeminiAPI(),
    geminiPro: await testGeminiPro(),
    contentGeneration: await testContentGeneration(),
    creativeStudioContent: await testCreativeStudioContent()
  };
  
  console.log('\n📊 Test Results Summary:');
  console.log('Gemini 2.5 Flash (Content):', results.geminiFlash ? '✅ PASS' : '❌ FAIL');
  console.log('Gemini 2.5 Pro (Content):', results.geminiPro ? '✅ PASS' : '❌ FAIL');
  console.log('Product Description Generation:', results.contentGeneration ? '✅ PASS' : '❌ FAIL');
  console.log('Creative Studio Content Generation:', results.creativeStudioContent ? '✅ PASS' : '❌ FAIL');
  
  const allPassed = Object.values(results).every(result => result);
  console.log('\nOverall Status:', allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED');
  
  return allPassed;
}

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

export { testGeminiAPI, testContentGeneration, runAllTests };