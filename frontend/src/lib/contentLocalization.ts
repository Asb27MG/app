import type { Product } from '@/types';

type SupportedLanguage = 'es' | 'en' | 'zh';

interface LocalizedFeature {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  benefits: string[];
  icon?: string;
}

interface LocalizedServiceData {
  id: string;
  titleKey: string;
  descriptionKey: string;
  features: LocalizedFeature[];
}

const fallbackProductsByLanguage: Record<SupportedLanguage, Record<string, Omit<Product, 'id' | 'image' | 'price'>>> = {
  es: {
    'product-camera1.jpg': {
      name: 'Cámara Bullet SECUREYE',
      description: 'Cámara de vigilancia bullet 1080p con visión nocturna IR',
      category: 'Categoría A',
      specs: [
        { label: 'Resolución', value: '1080p' },
        { label: 'Visión Nocturna', value: '40 LEDs IR' },
      ],
      features: ['Garantía 1 año', 'Soporte técnico'],
    },
    'product-camera2.jpg': {
      name: 'Cámara Domo Profesional',
      description: 'Cámara domo motorizada con zoom óptico 4x',
      category: 'Categoría B',
      specs: [
        { label: 'Resolución', value: '2MP' },
        { label: 'Zoom Óptico', value: '4x' },
      ],
      features: ['Incluye estuche'],
    },
    'product-nvr.jpg': {
      name: 'NVR ACME Secure 9000',
      description: 'Network Video Recorder 16 canales con PoE integrado',
      category: 'Categoría A',
      specs: [
        { label: 'Canales', value: '16' },
        { label: 'Almacenamiento', value: 'HDD interno' },
      ],
      features: ['Resistente al agua'],
    },
    'product-switch1.jpg': {
      name: 'Switch Nexuscore 9000 Series',
      description: 'Switch Ethernet profesional 24 puertos Gigabit',
      category: 'Admin Test',
      specs: [
        { label: 'Puertos', value: '24 Gigabit' },
        { label: 'Velocidad', value: '1000 Mbps' },
      ],
      features: [],
    },
    'product-switch2.jpg': {
      name: 'Switch Profesional PoE+',
      description: 'Switch PoE+ 18 puertos con soporte para cámaras IP',
      category: 'Test',
      specs: [
        { label: 'Puertos PoE+', value: '18' },
        { label: 'Power Budget', value: '370W' },
      ],
      features: ['Feature1'],
    },
  },
  en: {
    'product-camera1.jpg': {
      name: 'SECUREYE Bullet Camera',
      description: '1080p bullet surveillance camera with IR night vision',
      category: 'Category A',
      specs: [
        { label: 'Resolution', value: '1080p' },
        { label: 'Night Vision', value: '40 IR LEDs' },
      ],
      features: ['1-year warranty', 'Technical support'],
    },
    'product-camera2.jpg': {
      name: 'Professional Dome Camera',
      description: 'Motorized dome camera with 4x optical zoom',
      category: 'Category B',
      specs: [
        { label: 'Resolution', value: '2MP' },
        { label: 'Optical Zoom', value: '4x' },
      ],
      features: ['Carrying case included'],
    },
    'product-nvr.jpg': {
      name: 'NVR ACME Secure 9000',
      description: '16-channel network video recorder with integrated PoE',
      category: 'Category A',
      specs: [
        { label: 'Channels', value: '16' },
        { label: 'Storage', value: 'Internal HDD' },
      ],
      features: ['Water resistant'],
    },
    'product-switch1.jpg': {
      name: 'Nexuscore 9000 Series Switch',
      description: 'Professional 24-port Gigabit Ethernet switch',
      category: 'Admin Test',
      specs: [
        { label: 'Ports', value: '24 Gigabit' },
        { label: 'Speed', value: '1000 Mbps' },
      ],
      features: [],
    },
    'product-switch2.jpg': {
      name: 'Professional PoE+ Switch',
      description: '18-port PoE+ switch with support for IP cameras',
      category: 'Test',
      specs: [
        { label: 'PoE+ Ports', value: '18' },
        { label: 'Power Budget', value: '370W' },
      ],
      features: ['Feature 1'],
    },
  },
  zh: {
    'product-camera1.jpg': {
      name: 'SECUREYE 枪型摄像机',
      description: '配备红外夜视的 1080p 枪型监控摄像机',
      category: 'A 类',
      specs: [
        { label: '分辨率', value: '1080p' },
        { label: '夜视功能', value: '40 个红外 LED' },
      ],
      features: ['1 年保修', '技术支持'],
    },
    'product-camera2.jpg': {
      name: '专业半球摄像机',
      description: '带 4 倍光学变焦的电动半球摄像机',
      category: 'B 类',
      specs: [
        { label: '分辨率', value: '2MP' },
        { label: '光学变焦', value: '4x' },
      ],
      features: ['含便携保护盒'],
    },
    'product-nvr.jpg': {
      name: 'NVR ACME Secure 9000',
      description: '带集成 PoE 的 16 路网络录像机',
      category: 'A 类',
      specs: [
        { label: '通道数', value: '16' },
        { label: '存储', value: '内置硬盘' },
      ],
      features: ['防水设计'],
    },
    'product-switch1.jpg': {
      name: 'Nexuscore 9000 系列交换机',
      description: '专业级 24 端口千兆以太网交换机',
      category: '管理测试',
      specs: [
        { label: '端口', value: '24 千兆' },
        { label: '速率', value: '1000 Mbps' },
      ],
      features: [],
    },
    'product-switch2.jpg': {
      name: '专业 PoE+ 交换机',
      description: '18 端口 PoE+ 交换机，支持 IP 摄像机',
      category: '测试',
      specs: [
        { label: 'PoE+ 端口', value: '18' },
        { label: '功率预算', value: '370W' },
      ],
      features: ['功能 1'],
    },
  },
};

const serviceDataByLanguage: Record<SupportedLanguage, Record<string, LocalizedServiceData>> = {
  es: {
    vigilancia: {
      id: 'vigilancia',
      titleKey: 'services-vigilancia-titulo',
      descriptionKey: 'services-vigilancia-detalles',
      features: [
        {
          id: 'cameras',
          title: 'Cámaras IP 4K/8K',
          shortDesc: 'Resolución ultra alta definición',
          fullDesc: 'Cámaras de última generación con sensores avanzados que capturan cada detalle en resolución 4K o 8K. Ideales para identificación facial precisa y lectura de placas a distancia.',
          benefits: ['Identificación facial hasta 50 metros', 'Zoom digital sin pérdida', 'Captura de detalles finos', 'Evidencia de alta calidad'],
          icon: '📹',
        },
        {
          id: 'analytics',
          title: 'Analítica de video con IA',
          shortDesc: 'Detección inteligente de comportamientos',
          fullDesc: 'Sistema de inteligencia artificial que analiza video en tiempo real para detectar comportamientos sospechosos, contar personas y generar alertas proactivas.',
          benefits: ['Detección automática de intrusos', 'Conteo de aforo en tiempo real', 'Reconocimiento de objetos abandonados', 'Alertas por comportamiento inusual'],
          icon: '🧠',
        },
        {
          id: 'night',
          title: 'Visión nocturna',
          shortDesc: 'Claridad total en oscuridad total',
          fullDesc: 'Tecnología infrarroja y Starlight para ver con gran nitidez incluso en condiciones de iluminación mínima.',
          benefits: ['Visión en color de noche', 'Alcance IR de hasta 100 metros', 'Operación discreta', 'Termografía opcional'],
          icon: '🌙',
        },
        {
          id: 'cloud',
          title: 'Almacenamiento en nube',
          shortDesc: 'Tus grabaciones seguras y accesibles',
          fullDesc: 'Almacenamiento escalable en la nube con cifrado robusto y acceso remoto desde cualquier dispositivo.',
          benefits: ['Acceso desde cualquier lugar', 'Cifrado AES-256', 'Retención configurable', 'Protección ante daño físico'],
          icon: '☁️',
        },
        {
          id: 'mobile',
          title: 'Notificaciones móviles',
          shortDesc: 'Alertas instantáneas en tu celular',
          fullDesc: 'Sistema de alertas inteligentes con filtros de IA para distinguir amenazas reales y reducir falsas alarmas.',
          benefits: ['Alertas en tiempo real', 'Menos falsas alarmas', 'Vista previa del evento', 'Activación remota de sirena'],
          icon: '📱',
        },
      ],
    },
    acceso: {
      id: 'acceso',
      titleKey: 'services-acceso-titulo',
      descriptionKey: 'services-acceso-detalles',
      features: [
        {
          id: 'biometric',
          title: 'Lectores biométricos',
          shortDesc: 'Huella digital y reconocimiento facial',
          fullDesc: 'Lectores biométricos que utilizan rasgos únicos para verificar identidad con alta precisión.',
          benefits: ['Precisión del 99.9%', 'No se pueden compartir', 'Opciones sin contacto', 'Integración con sistemas existentes'],
          icon: '👆',
        },
        {
          id: 'rfid',
          title: 'Tarjetas RFID/NFC',
          shortDesc: 'Acceso sin contacto inteligente',
          fullDesc: 'Tarjetas inteligentes para acceso rápido y seguro mediante radiofrecuencia.',
          benefits: ['Acceso en menos de 0.5 segundos', 'Comunicación cifrada', 'Desactivación remota', 'Soporte multiaplicación'],
          icon: '💳',
        },
        {
          id: 'motion',
          title: 'Sensores de movimiento',
          shortDesc: 'Detecta movimiento no autorizado',
          fullDesc: 'Sensores PIR y microondas que distinguen entre personas, animales y factores ambientales.',
          benefits: ['Cobertura de 360°', 'Inmunidad a mascotas', 'Sensibilidad configurable', 'Integración con alarmas'],
          icon: '🚶',
        },
        {
          id: 'locks',
          title: 'Cerraduras electrónicas',
          shortDesc: 'Mecanismos de bloqueo inteligentes',
          fullDesc: 'Cerraduras motorizadas con múltiples métodos de autenticación y registros de auditoría.',
          benefits: ['Sin llave física', 'Registro de accesos', 'Respaldo por batería', 'Modelos para exterior'],
          icon: '🔒',
        },
      ],
    },
    redes: {
      id: 'redes',
      titleKey: 'services-red-titulo',
      descriptionKey: 'services-red-detalles',
      features: [
        {
          id: 'cabling',
          title: 'Cableado Cat6/Cat6A',
          shortDesc: 'Infraestructura de alta velocidad',
          fullDesc: 'Instalación profesional de cableado estructurado preparado para hasta 10 Gbps.',
          benefits: ['Hasta 10 Gbps', 'Soporte PoE++', 'Menor interferencia', 'Garantía extendida'],
          icon: '🔌',
        },
        {
          id: 'switches',
          title: 'Switches administrables',
          shortDesc: 'Gestión de red empresarial',
          fullDesc: 'Switches capa 2 y 3 con VLAN, QoS y funciones avanzadas de seguridad.',
          benefits: ['Segmentación VLAN', 'QoS', 'Agregación de enlaces', 'Gestión remota'],
          icon: '🔀',
        },
        {
          id: 'wifi',
          title: 'WiFi 6/6E',
          shortDesc: 'Conectividad inalámbrica de última generación',
          fullDesc: 'Tecnología WiFi moderna para mayores velocidades, menor latencia y mejor rendimiento en ambientes densos.',
          benefits: ['Hasta 9.6 Gbps', 'OFDMA eficiente', 'Mejor para muchos dispositivos', 'Soporte de 6 GHz'],
          icon: '📶',
        },
        {
          id: 'monitoring',
          title: 'Monitoreo 24/7',
          shortDesc: 'Vigilancia continua de red',
          fullDesc: 'Monitoreo constante con alertas automáticas y resolución proactiva de incidentes.',
          benefits: ['Métricas en tiempo real', 'Alertas automáticas', 'Tendencias históricas', 'Reportes mensuales'],
          icon: '📊',
        },
      ],
    },
    ciberseguridad: {
      id: 'ciberseguridad',
      titleKey: 'services-ciber-titulo',
      descriptionKey: 'services-ciber-detalles',
      features: [
        {
          id: 'firewall',
          title: 'Firewalls NGFW',
          shortDesc: 'Protección de nueva generación',
          fullDesc: 'Firewalls con inspección profunda de paquetes y control avanzado de aplicaciones.',
          benefits: ['Filtrado por aplicación', 'IPS integrado', 'Inspección SSL/TLS', 'Sandboxing'],
          icon: '🛡️',
        },
        {
          id: 'ids',
          title: 'IDS/IPS',
          shortDesc: 'Detección y prevención de intrusiones',
          fullDesc: 'Sistemas que monitorean actividad sospechosa y bloquean amenazas automáticamente.',
          benefits: ['Detección en tiempo real', 'Respuesta automática', 'Firmas y anomalías', 'Reportes detallados'],
          icon: '🔍',
        },
        {
          id: 'antivirus',
          title: 'Antivirus empresarial',
          shortDesc: 'Protección centralizada de endpoints',
          fullDesc: 'Protección contra malware, ransomware y phishing con análisis de comportamiento.',
          benefits: ['Detección con IA', 'Rollback ante ransomware', 'Control de dispositivos', 'Políticas centralizadas'],
          icon: '🦠',
        },
        {
          id: 'audits',
          title: 'Auditorías de seguridad',
          shortDesc: 'Evaluación de vulnerabilidades',
          fullDesc: 'Pruebas de penetración, escaneo de vulnerabilidades y revisión de cumplimiento.',
          benefits: ['Pentesting', 'Cumplimiento ISO/NIST', 'Plan de remediación', 'Resumen ejecutivo'],
          icon: '📋',
        },
      ],
    },
  },
  en: {
    vigilancia: {
      id: 'vigilancia',
      titleKey: 'services-vigilancia-titulo',
      descriptionKey: 'services-vigilancia-detalles',
      features: [
        {
          id: 'cameras',
          title: '4K/8K IP Cameras',
          shortDesc: 'Ultra high-definition resolution',
          fullDesc: 'Next-generation cameras with advanced sensors that capture every detail in 4K or 8K resolution for precise identification and monitoring.',
          benefits: ['Facial identification up to 50 meters', 'Lossless digital zoom', 'Fine detail capture', 'High-quality evidence'],
          icon: '📹',
        },
        {
          id: 'analytics',
          title: 'AI Video Analytics',
          shortDesc: 'Intelligent behavior detection',
          fullDesc: 'Artificial intelligence analyzes video in real time to detect suspicious behavior, count people, and trigger proactive alerts.',
          benefits: ['Automatic intruder detection', 'Real-time occupancy counting', 'Abandoned object recognition', 'Unusual behavior alerts'],
          icon: '🧠',
        },
        {
          id: 'night',
          title: 'Night Vision',
          shortDesc: 'Total clarity in total darkness',
          fullDesc: 'Infrared and Starlight technology provide excellent visibility even in extremely low-light conditions.',
          benefits: ['Full-color night vision', 'IR range up to 100 meters', 'Discrete operation', 'Optional thermography'],
          icon: '🌙',
        },
        {
          id: 'cloud',
          title: 'Cloud Storage',
          shortDesc: 'Secure and accessible recordings',
          fullDesc: 'Scalable cloud storage with strong encryption and remote access from any device.',
          benefits: ['Access from anywhere', 'AES-256 encryption', 'Configurable retention', 'Protection against physical damage'],
          icon: '☁️',
        },
        {
          id: 'mobile',
          title: 'Mobile Notifications',
          shortDesc: 'Instant alerts on your phone',
          fullDesc: 'Smart alerting with AI filters to distinguish real threats and reduce false alarms.',
          benefits: ['Real-time alerts', 'Fewer false alarms', 'Event preview', 'Remote siren activation'],
          icon: '📱',
        },
      ],
    },
    acceso: {
      id: 'acceso',
      titleKey: 'services-acceso-titulo',
      descriptionKey: 'services-acceso-detalles',
      features: [
        {
          id: 'biometric',
          title: 'Biometric Readers',
          shortDesc: 'Fingerprint and facial recognition',
          fullDesc: 'Biometric readers use unique human traits to verify identity with high accuracy.',
          benefits: ['99.9% accuracy', 'Cannot be shared', 'Touchless options', 'Integration with existing systems'],
          icon: '👆',
        },
        {
          id: 'rfid',
          title: 'RFID/NFC Cards',
          shortDesc: 'Smart contactless access',
          fullDesc: 'Smart cards enable fast and secure access through radio-frequency technology.',
          benefits: ['Access in under 0.5 seconds', 'Encrypted communication', 'Remote deactivation', 'Multi-application support'],
          icon: '💳',
        },
        {
          id: 'motion',
          title: 'Motion Sensors',
          shortDesc: 'Detect unauthorized movement',
          fullDesc: 'PIR and microwave sensors distinguish people, animals, and environmental changes.',
          benefits: ['360° coverage', 'Pet immunity', 'Adjustable sensitivity', 'Alarm integration'],
          icon: '🚶',
        },
        {
          id: 'locks',
          title: 'Electronic Locks',
          shortDesc: 'Smart locking mechanisms',
          fullDesc: 'Motorized locks with multiple authentication methods and audit trails.',
          benefits: ['No physical key required', 'Access logs', 'Battery backup', 'Outdoor-rated models'],
          icon: '🔒',
        },
      ],
    },
    redes: {
      id: 'redes',
      titleKey: 'services-red-titulo',
      descriptionKey: 'services-red-detalles',
      features: [
        {
          id: 'cabling',
          title: 'Cat6/Cat6A Cabling',
          shortDesc: 'High-speed infrastructure',
          fullDesc: 'Professional structured cabling installation ready to support up to 10 Gbps.',
          benefits: ['Up to 10 Gbps', 'PoE++ support', 'Lower interference', 'Extended warranty'],
          icon: '🔌',
        },
        {
          id: 'switches',
          title: 'Managed Switches',
          shortDesc: 'Enterprise network management',
          fullDesc: 'Layer 2 and Layer 3 switches with VLAN, QoS, and advanced security features.',
          benefits: ['VLAN segmentation', 'QoS', 'Link aggregation', 'Remote management'],
          icon: '🔀',
        },
        {
          id: 'wifi',
          title: 'WiFi 6/6E',
          shortDesc: 'Next-generation wireless connectivity',
          fullDesc: 'Modern WiFi technology for higher speeds, lower latency, and better performance in dense environments.',
          benefits: ['Up to 9.6 Gbps', 'Efficient OFDMA', 'Better for many devices', '6 GHz support'],
          icon: '📶',
        },
        {
          id: 'monitoring',
          title: '24/7 Monitoring',
          shortDesc: 'Continuous network oversight',
          fullDesc: 'Continuous monitoring with automated alerts and proactive incident resolution.',
          benefits: ['Real-time metrics', 'Automated alerts', 'Historical trends', 'Monthly reports'],
          icon: '📊',
        },
      ],
    },
    ciberseguridad: {
      id: 'ciberseguridad',
      titleKey: 'services-ciber-titulo',
      descriptionKey: 'services-ciber-detalles',
      features: [
        {
          id: 'firewall',
          title: 'NGFW Firewalls',
          shortDesc: 'Next-generation protection',
          fullDesc: 'Firewalls with deep packet inspection and advanced application control.',
          benefits: ['Application filtering', 'Integrated IPS', 'SSL/TLS inspection', 'Sandboxing'],
          icon: '🛡️',
        },
        {
          id: 'ids',
          title: 'IDS/IPS',
          shortDesc: 'Intrusion detection and prevention',
          fullDesc: 'Systems that monitor suspicious activity and automatically block threats.',
          benefits: ['Real-time detection', 'Automatic response', 'Signature and anomaly based', 'Detailed reporting'],
          icon: '🔍',
        },
        {
          id: 'antivirus',
          title: 'Enterprise Antivirus',
          shortDesc: 'Centralized endpoint protection',
          fullDesc: 'Protection against malware, ransomware, and phishing with behavioral analysis.',
          benefits: ['AI-driven detection', 'Ransomware rollback', 'Device control', 'Centralized policies'],
          icon: '🦠',
        },
        {
          id: 'audits',
          title: 'Security Audits',
          shortDesc: 'Vulnerability assessment',
          fullDesc: 'Penetration tests, vulnerability scanning, and compliance review services.',
          benefits: ['Pentesting', 'ISO/NIST compliance', 'Remediation roadmap', 'Executive summary'],
          icon: '📋',
        },
      ],
    },
  },
  zh: {
    vigilancia: {
      id: 'vigilancia',
      titleKey: 'services-vigilancia-titulo',
      descriptionKey: 'services-vigilancia-detalles',
      features: [
        {
          id: 'cameras',
          title: '4K/8K IP 摄像机',
          shortDesc: '超高清分辨率',
          fullDesc: '新一代摄像机配备先进传感器，可捕捉 4K 或 8K 分辨率下的每个细节，适合精确识别与监控。',
          benefits: ['最远 50 米人脸识别', '无损数字变焦', '细节捕捉更清晰', '高质量取证'],
          icon: '📹',
        },
        {
          id: 'analytics',
          title: 'AI 视频分析',
          shortDesc: '智能行为检测',
          fullDesc: '人工智能可实时分析视频，识别可疑行为、统计人数并触发主动告警。',
          benefits: ['自动入侵检测', '实时人数统计', '遗留物识别', '异常行为告警'],
          icon: '🧠',
        },
        {
          id: 'night',
          title: '夜视功能',
          shortDesc: '全黑环境下依然清晰',
          fullDesc: '红外与星光技术即使在极低照度条件下也能提供出色可视性。',
          benefits: ['夜间全彩图像', '红外最远 100 米', '隐蔽运行', '支持热成像'],
          icon: '🌙',
        },
        {
          id: 'cloud',
          title: '云存储',
          shortDesc: '录像安全且随时可取',
          fullDesc: '可扩展云存储配合强加密机制，并支持任意设备远程访问。',
          benefits: ['随时随地访问', 'AES-256 加密', '保留周期可配置', '免受物理损坏影响'],
          icon: '☁️',
        },
        {
          id: 'mobile',
          title: '移动通知',
          shortDesc: '手机即时告警',
          fullDesc: '智能告警结合 AI 过滤，区分真实威胁并减少误报。',
          benefits: ['实时通知', '更少误报', '事件预览', '远程触发警报'],
          icon: '📱',
        },
      ],
    },
    acceso: {
      id: 'acceso',
      titleKey: 'services-acceso-titulo',
      descriptionKey: 'services-acceso-detalles',
      features: [
        {
          id: 'biometric',
          title: '生物识别读卡器',
          shortDesc: '指纹与人脸识别',
          fullDesc: '通过人体唯一特征进行身份验证，具备极高精度。',
          benefits: ['99.9% 精度', '不可共享', '支持无接触识别', '可集成现有系统'],
          icon: '👆',
        },
        {
          id: 'rfid',
          title: 'RFID/NFC 卡',
          shortDesc: '智能无接触通行',
          fullDesc: '通过射频技术实现快速且安全的门禁访问。',
          benefits: ['0.5 秒内通行', '通信加密', '支持远程停用', '多应用支持'],
          icon: '💳',
        },
        {
          id: 'motion',
          title: '运动传感器',
          shortDesc: '检测未授权活动',
          fullDesc: 'PIR 与微波传感器可区分人员、动物和环境变化。',
          benefits: ['360° 覆盖', '宠物免疫', '灵敏度可调', '可联动报警系统'],
          icon: '🚶',
        },
        {
          id: 'locks',
          title: '电子锁',
          shortDesc: '智能锁闭机制',
          fullDesc: '电动锁支持多种认证方式，并提供审计日志。',
          benefits: ['无需实体钥匙', '访问日志', '电池备用', '支持室外型号'],
          icon: '🔒',
        },
      ],
    },
    redes: {
      id: 'redes',
      titleKey: 'services-red-titulo',
      descriptionKey: 'services-red-detalles',
      features: [
        {
          id: 'cabling',
          title: 'Cat6/Cat6A 布线',
          shortDesc: '高速网络基础设施',
          fullDesc: '专业结构化布线安装，可支持高达 10 Gbps 的传输。',
          benefits: ['最高 10 Gbps', '支持 PoE++', '降低干扰', '延长保修'],
          icon: '🔌',
        },
        {
          id: 'switches',
          title: '网管交换机',
          shortDesc: '企业级网络管理',
          fullDesc: '支持 VLAN、QoS 与高级安全特性的二层/三层交换机。',
          benefits: ['VLAN 分段', 'QoS', '链路聚合', '远程管理'],
          icon: '🔀',
        },
        {
          id: 'wifi',
          title: 'WiFi 6/6E',
          shortDesc: '新一代无线连接',
          fullDesc: '现代 WiFi 技术可在高密度环境中提供更高速度、更低延迟与更好表现。',
          benefits: ['最高 9.6 Gbps', '高效 OFDMA', '更适合多设备环境', '支持 6 GHz'],
          icon: '📶',
        },
        {
          id: 'monitoring',
          title: '24/7 监控',
          shortDesc: '持续网络监管',
          fullDesc: '持续监控配合自动告警与主动事件处理。',
          benefits: ['实时指标', '自动告警', '历史趋势', '月度报告'],
          icon: '📊',
        },
      ],
    },
    ciberseguridad: {
      id: 'ciberseguridad',
      titleKey: 'services-ciber-titulo',
      descriptionKey: 'services-ciber-detalles',
      features: [
        {
          id: 'firewall',
          title: 'NGFW 防火墙',
          shortDesc: '新一代安全防护',
          fullDesc: '防火墙具备深度包检测与高级应用控制能力。',
          benefits: ['应用层过滤', '集成 IPS', 'SSL/TLS 检测', '沙箱能力'],
          icon: '🛡️',
        },
        {
          id: 'ids',
          title: 'IDS/IPS',
          shortDesc: '入侵检测与防御',
          fullDesc: '系统持续监控可疑活动并自动阻断威胁。',
          benefits: ['实时检测', '自动响应', '基于特征与异常', '详细报告'],
          icon: '🔍',
        },
        {
          id: 'antivirus',
          title: '企业级杀毒',
          shortDesc: '集中式终端防护',
          fullDesc: '通过行为分析防护恶意软件、勒索软件和钓鱼攻击。',
          benefits: ['AI 检测', '勒索软件回滚', '设备控制', '集中策略'],
          icon: '🦠',
        },
        {
          id: 'audits',
          title: '安全审计',
          shortDesc: '漏洞评估',
          fullDesc: '提供渗透测试、漏洞扫描与合规性审查服务。',
          benefits: ['渗透测试', 'ISO/NIST 合规', '整改路线图', '高层摘要'],
          icon: '📋',
        },
      ],
    },
  },
};

function resolveLanguage(language?: string): SupportedLanguage {
  const normalized = (language ?? 'es').split('-')[0];
  if (normalized === 'en' || normalized === 'zh') {
    return normalized;
  }

  return 'es';
}

function getProductTranslationKey(product: Product): string | null {
  const imageName = product.image.split('/').pop();
  if (imageName && imageName in fallbackProductsByLanguage.es) {
    return imageName;
  }

  return null;
}

export function localizeProduct(product: Product, language?: string): Product {
  const resolvedLanguage = resolveLanguage(language);
  const productKey = getProductTranslationKey(product);

  if (!productKey) {
    return product;
  }

  const localizedProduct = fallbackProductsByLanguage[resolvedLanguage][productKey];

  return {
    ...product,
    ...localizedProduct,
    specs: localizedProduct.specs,
    features: localizedProduct.features,
  };
}

export function getLocalizedServiceData(language?: string): Record<string, LocalizedServiceData> {
  return serviceDataByLanguage[resolveLanguage(language)];
}
