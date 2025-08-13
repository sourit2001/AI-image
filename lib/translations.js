// Translation files for internationalization
export const translations = {
  en: {
    // Header
    login: 'Login',
    register: 'Register',
    backToHome: '← Back to Home',
    
    // Homepage
    title: 'AI Photo Studio',
    subtitle: 'Transform your images with advanced AI technology. No professional skills required, one-click completion of all operations.',
    
    // Features
    features: {
      removeText: {
        title: 'Remove Text',
        description: 'Intelligently detect and remove text/watermarks from images'
      },
      upscale: {
        title: 'Image Upscale',
        description: 'AI-powered high-resolution image enhancement and clarity improvement'
      },
      removeBackground: {
        title: 'Remove Background',
        description: 'One-click background removal for transparent effects'
      },
      haircutChange: {
        title: 'Change Haircut & Color',
        description: 'Intelligently modify hairstyles and hair color styles'
      },
      professionalHeadshot: {
        title: 'Professional Headshot',
        description: 'Generate professional business portrait photos'
      },
      emojiMaker: {
        title: 'Generate Emoji',
        description: 'Transform your images into fun emoji expressions'
      }
    },
    
    // Pricing
    pricing: {
      title: 'Choose Your Plan',
      subtitle: 'Start with free experience, upgrade to professional version anytime',
      mostPopular: 'Most Popular',
      plans: {
        free: {
          name: 'Free Plan',
          description: 'Perfect for personal users to experience',
          features: [
            '5 free processes per month',
            'Basic feature support',
            'Standard processing speed',
            'Community support'
          ],
          buttonText: 'Get Started Free'
        },
        professional: {
          name: 'Professional Plan',
          description: 'Perfect for individuals and small teams',
          features: [
            '100 processes per month',
            'All features fully supported',
            'High-speed processing priority',
            'Priority customer support',
            'High-definition output quality'
          ],
          buttonText: 'Start Using'
        },
        enterprise: {
          name: 'Enterprise Plan',
          description: 'Perfect for large teams and enterprises',
          features: [
            'Unlimited processes',
            'API interface support',
            'Batch processing functionality',
            'Dedicated customer manager',
            'Customized solutions'
          ],
          buttonText: 'Contact Sales'
        }
      }
    },
    
    // Common UI elements
    selectImage: 'Select Image',
    selectedFile: 'Selected: ',
    startProcessing: 'Start Processing',
    processing: 'Processing...',
    generating: 'Generating...',
    processingComplete: 'Processing Complete!',
    processingStatus: 'Processing... ({status})',
    processingFailed: 'Processing failed: {error}',
    originalPreview: 'Original Preview',
    processedResult: 'Processed Result',
    resultWillShow: 'Result will be displayed here',
    downloadResult: 'Download Result',
    pleaseSelectImage: 'Please select an image',
    generateEmoji: 'Generate Emoji',
    removeBackground: 'Remove Background',
    generateHeadshot: 'Generate Headshot',
    changeHaircut: 'Change Haircut',
    upscaleImage: 'Upscale Image',
    promptLabel: 'Enter Description (Prompt)',
    promptPlaceholder: 'e.g., a smiling face with sunglasses',
    genderLabel: 'Gender',
    backgroundLabel: 'Background',
    aspectRatioLabel: 'Aspect Ratio',
    scaleLabel: 'Scale Factor',
    selectGender: 'Select Gender',
    selectBackground: 'Select Background',
    selectAspectRatio: 'Select Aspect Ratio',
    selectScale: 'Select Scale',
    processingMode: 'Processing Mode',
    faceEnhancement: 'Face Enhancement',
    standard: 'Standard',
    lowResolution: 'Low Resolution',
    highFidelity: 'High Fidelity',
    textRefine: 'Text Refine',
    
    // Feature specific
    removeTextTitle: 'Remove Text',
    removeTextDescription: 'Intelligently identify and remove all text content from images',
    emojiMakerTitle: 'Emoji Maker',
    emojiMakerDescription: 'Upload images, enter descriptions, create your exclusive Emoji!',
    backgroundRemovalTitle: 'Background Removal',
    backgroundRemovalDescription: 'Automatically remove image backgrounds with AI precision',
    professionalHeadshotTitle: 'Professional Headshot',
    professionalHeadshotDescription: 'Transform your photos into professional business headshots',
    haircutChangeTitle: 'Haircut & Color Change',
    haircutChangeDescription: 'Try different hairstyles and hair colors with AI',
    upscaleTitle: 'Image Upscale',
    upscaleDescription: 'Enhance image resolution and quality with AI upscaling',
    
    // Error messages
    errors: {
      pleaseSelectImage: 'Please select an image first',
      pleaseEnterPrompt: 'Please enter a description (Prompt)',
      pleaseSelectGender: 'Please select a gender',
      invalidHaircutOption: 'Haircut must be an officially supported English option!',
      requestFailed: 'Request failed',
      processingFailed: 'Processing failed',
      imageUploadFailed: 'Image upload failed, please try again or change image format',
      unknownError: 'Unknown error',
    }
  },
  
  zh: {
    // Header
    login: '登录',
    register: '注册',
    backToHome: '← 返回首页',
    
    // Homepage
    title: 'AI Photo Studio',
    subtitle: '使用先进的AI技术，轻松完成图片编辑任务。不需专业技能，一键完成所有操作。',
    
    // Features
    features: {
      removeText: {
        title: '消除文字',
        description: '智能识别并移除图片中的文字内容'
      },
      upscale: {
        title: '图片放大',
        description: '高清放大图片，提升分辨率和清晰度'
      },
      removeBackground: {
        title: '消除背景',
        description: '一键移除图片背景，获得透明效果'
      },
      haircutChange: {
        title: '变换发型和发色',
        description: '智能修改人物发型和发色风格'
      },
      professionalHeadshot: {
        title: '职业头像',
        description: '生成专业的职业头像照片'
      },
      emojiMaker: {
        title: '生成Emoji',
        description: '将你的图片转换为有趣的Emoji表情'
      }
    },
    
    // Pricing
    pricing: {
      title: '选择适合你的计划',
      subtitle: '从免费体验开始，随时升级到专业版本',
      mostPopular: '最受欢迎',
      plans: {
        free: {
          name: '免费版',
          description: '适合个人用户体验',
          features: [
            '每月 5 次免费处理',
            '基础功能支持',
            '标准处理速度',
            '社区支持'
          ],
          buttonText: '免费使用'
        },
        professional: {
          name: '专业版',
          description: '适合个人和小团队',
          features: [
            '每月 100 次处理',
            '所有功能全面支持',
            '高速处理优先级',
            '优先客服支持',
            '高清输出质量'
          ],
          buttonText: '开始使用'
        },
        enterprise: {
          name: '企业版',
          description: '适合大型团队和企业',
          features: [
            '无限次处理',
            'API 接口支持',
            '批量处理功能',
            '专属客服经理',
            '定制化解决方案'
          ],
          buttonText: '联系销售'
        }
      }
    },
    
    // Common UI elements
    selectImage: '选择图片',
    selectedFile: '已选择: ',
    startProcessing: '开始处理',
    processing: '处理中...',
    generating: '生成中...',
    processingComplete: '处理完成！',
    processingStatus: '处理中... ({status})',
    processingFailed: '处理失败：{error}',
    originalPreview: '原图预览',
    processedResult: '处理结果',
    resultWillShow: '结果将在此显示',
    downloadResult: '下载结果',
    pleaseSelectImage: '请选择图片',
    generateEmoji: '开始生成Emoji',
    removeBackground: '开始消除背景',
    generateHeadshot: '生成职业头像',
    changeHaircut: '开始变换发型',
    upscaleImage: '开始放大图片',
    promptLabel: '输入描述 (Prompt)',
    promptPlaceholder: '例如：戴墨镜的笑脸',
    genderLabel: '性别',
    backgroundLabel: '背景',
    aspectRatioLabel: '宽高比',
    scaleLabel: '放大倍数',
    selectGender: '选择性别',
    selectBackground: '选择背景',
    selectAspectRatio: '选择宽高比',
    selectScale: '选择放大倍数',
    processingMode: '处理模式',
    faceEnhancement: '人脸增强',
    standard: '标准',
    lowResolution: '低分辨率',
    highFidelity: '高保真',
    textRefine: '文本优化',
    
    // Feature specific
    removeTextTitle: '消除文字',
    removeTextDescription: '智能识别并移除图片中的所有文字内容',
    emojiMakerTitle: '生成Emoji',
    emojiMakerDescription: '上传图片，输入描述，创造你专属的Emoji！',
    backgroundRemovalTitle: '消除背景',
    backgroundRemovalDescription: '使用AI精确自动移除图片背景',
    professionalHeadshotTitle: '职业头像',
    professionalHeadshotDescription: '将你的照片转换为专业商务头像',
    haircutChangeTitle: '发型发色变换',
    haircutChangeDescription: '使用AI尝试不同的发型和发色',
    upscaleTitle: '图片放大',
    upscaleDescription: '使用AI放大技术提升图片分辨率和质量',
    
    // Error messages
    errors: {
      pleaseSelectImage: '请先选择图片',
      pleaseEnterPrompt: '请输入描述文字 (Prompt)',
      pleaseSelectGender: '请选择性别',
      invalidHaircutOption: '发型必须为官方支持的英文选项！',
      requestFailed: '请求失败',
      processingFailed: '处理失败',
      imageUploadFailed: '图片上传失败，请重试或更换图片格式',
      unknownError: '未知错误',
    }
  }
};

// Helper function to get translation
export function getTranslation(language, key) {
  const keys = key.split('.');
  let value = translations[language] || translations.en;
  
  for (const k of keys) {
    value = value[k];
    if (!value) break;
  }
  
  return value || key;
}

// Helper function to interpolate variables in translations
export function t(language, key, variables = {}) {
  let text = getTranslation(language, key);
  
  // Replace variables in the format {variableName}
  Object.keys(variables).forEach(variable => {
    const regex = new RegExp(`{${variable}}`, 'g');
    text = text.replace(regex, variables[variable]);
  });
  
  return text;
}
