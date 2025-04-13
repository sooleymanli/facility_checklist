import dayjs from 'dayjs';

// Sample data types
export interface RecordType {
  key: React.Key;
  roomName: string;
  date: string;
  floorName: string;
  category: string;
  light: boolean | null;
  equipment: boolean | null;
  underTable: boolean | null;
  wall: boolean | null;
  ceiling: boolean | null;
  window: boolean | null;
  door: boolean | null;
  floorCondition: boolean | null;
  chair: boolean | null;
  inspector: string;
  signature: string;
}

// Sample floor and tab data
export const FLOORS = [
  { key: 'first-floor', label: '1ci mərtəbə' },
  { key: 'second-floor', label: '2ci mərtəbə' },
  { key: 'third-floor', label: '3cü mərtəbə' },
  { key: 'fourth-floor', label: '4cü mərtəbə' },
  { key: 'dalga', label: 'Dalğa' },
];

export const TABS = [
  { key: 'rooms', label: 'Otaqlar' },
  { key: 'cleaning', label: 'Təmizlik' },
  { key: 'vehicles', label: 'Maşınlar' },
  { key: 'temperature', label: 'Temperator' },
];

// Sample room names
export const roomNames = [
  'HR Otağı',
  'İT Otağı',
  'Kitabxana',
  'Mətbəx',
  'Konfrans Zalı',
  'Direktor Otağı',
  'Qonaq Otağı',
  'Arxiv',
  'Tədris Otağı',
  'Laboratoriya',
];

// Generate sample data
export const generateSampleData = (startDate: dayjs.Dayjs, endDate: dayjs.Dayjs): RecordType[] => {
  const data: RecordType[] = [];
  let currentDate = startDate.clone();
  let key = 0;

  const inspectors = ['Əli Əliyev', 'Anar Hüseynov', 'Sevinc Məmmədova', 'Leyla Hacıyeva', 'Elmar Nəzərov'];

  while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
    const dateStr = currentDate.format('DD.MM.YYYY');
    
    FLOORS.forEach(floor => {
      TABS.forEach(tab => {
        for (let i = 0; i < 5; i++) {
          const randomRoom = roomNames[Math.floor(Math.random() * roomNames.length)];
          const randomInspector = inspectors[Math.floor(Math.random() * inspectors.length)];
          data.push({
            key: key++,
            roomName: randomRoom,
            date: dateStr,
            floorName: floor.label,
            category: tab.label,
            light: Math.random() > 0.3 ? Math.random() > 0.5 : null,
            equipment: Math.random() > 0.3 ? Math.random() > 0.5 : null,
            underTable: Math.random() > 0.3 ? Math.random() > 0.5 : null,
            wall: Math.random() > 0.3 ? Math.random() > 0.5 : null,
            ceiling: Math.random() > 0.3 ? Math.random() > 0.5 : null,
            window: Math.random() > 0.3 ? Math.random() > 0.5 : null,
            door: Math.random() > 0.3 ? Math.random() > 0.5 : null,
            floorCondition: Math.random() > 0.3 ? Math.random() > 0.5 : null,
            chair: Math.random() > 0.3 ? Math.random() > 0.5 : null,
            inspector: randomInspector,
            signature: 'signature_' + randomInspector.replace(/\s+/g, '_').toLowerCase() + '.png'
          });
        }
      });
    });
    
    currentDate = currentDate.add(1, 'day');
  }
  
  return data;
};

// Function to generate sample base64 signature
export const getBase64Signature = (signatureFileName: string) => {
  // This is a placeholder. In a real application, you would retrieve the actual base64 string from the server
  // For demo purposes, we'll generate a colored rectangle as a signature
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 100;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    // Generate a consistent color based on the signature file name
    const hash = signatureFileName.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const hue = hash % 360;
    
    // Draw background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw signature-like lines
    ctx.strokeStyle = `hsl(${hue}, 70%, 40%)`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    // Use the hash to generate a unique but consistent signature pattern
    let x = 20;
    for (let i = 0; i < signatureFileName.length; i++) {
      const char = signatureFileName.charCodeAt(i);
      const y = 50 + (char % 30) - 15;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      
      x += 15;
    }
    
    ctx.stroke();
    
    // Add some text
    const name = signatureFileName.split('_').slice(1).join(' ').replace('.png', '');
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.fillText(name, 20, 90);
  }
  
  return canvas.toDataURL('image/png');
}; 