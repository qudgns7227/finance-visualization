import fs from 'fs';
import path from 'path';
import { parseStringPromise } from 'xml2js';

const corpXmlPath = path.join(process.cwd(), 'corp.xml');
const outputPath = path.join(process.cwd(), 'src', 'data', 'corps.json');

async function convertXmlToJson() {
  try {
    console.log('XML 파일 파싱 중...');
    
    if (!fs.existsSync(corpXmlPath)) {
      console.log('corp.xml 파일을 찾을 수 없습니다. Downloads에서 복사해주세요.');
      return;
    }

    const xmlContent = fs.readFileSync(corpXmlPath, 'utf-8');
    const result = await parseStringPromise(xmlContent);

    const corps = result.result.list.map(item => ({
      corp_code: item.corp_code[0],
      corp_name: item.corp_name[0],
      corp_eng_name: item.corp_eng_name[0],
      stock_code: item.stock_code[0],
    }));

    // 데이터 디렉토리 생성
    const dataDir = path.dirname(outputPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(corps, null, 2));
    console.log(`✓ ${corps.length}개 기업 데이터가 ${outputPath}에 저장되었습니다.`);

  } catch (error) {
    console.error('XML 파일 파싱 중 오류 발생:', error.message);
    process.exit(1);
  }
}

convertXmlToJson();
