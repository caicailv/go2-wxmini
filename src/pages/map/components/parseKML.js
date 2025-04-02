function parseKML(kmlString) {
  // WGS-84椭球体参数
  const a = 6378245.0;                   // 长半轴
  const f = 1/298.3;                     // 扁率
  const b = a * (1 - f);                 // 短半轴
  const ee = (a * a - b * b) / (a * a);  // 第一偏心率平方

  // 判断坐标是否在中国范围内（更精确的边界）
  function isInChina(lat, lng) {
    // 中国大陆基本范围检查
    if (lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271) {
      return false;
    }
    
    // 排除台湾、香港、澳门区域
    // 台湾
    if (lng > 121.0 && lng < 122.0 && lat > 22.0 && lat < 25.5) {
      return false;
    }
    
    // 香港
    if (lng > 113.8 && lng < 114.5 && lat > 22.1 && lat < 22.7) {
      return false;
    }
    
    // 澳门
    if (lng > 113.4 && lng < 113.7 && lat > 22.0 && lat < 22.3) {
      return false;
    }
    
    return true;
  }

  // 计算纬度偏移量
  function transformLat(x, y) {
    let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * Math.PI) + 40.0 * Math.sin(y / 3.0 * Math.PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * Math.PI) + 320 * Math.sin(y * Math.PI / 30.0)) * 2.0 / 3.0;
    return ret;
  }

  // 计算经度偏移量
  function transformLng(x, y) {
    let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * Math.PI) + 40.0 * Math.sin(x / 3.0 * Math.PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * Math.PI) + 300.0 * Math.sin(x / 30.0 * Math.PI)) * 2.0 / 3.0;
    return ret;
  }

  // WGS-84转GCJ-02高精度算法
  function wgs84ToGcj02(lng, lat) {
    if (!isInChina(lat, lng)) {
      return {longitude: lng, latitude: lat};
    }
    
    const dLat = transformLat(lng - 105.0, lat - 35.0);
    const dLng = transformLng(lng - 105.0, lat - 35.0);
    
    const radLat = lat / 180.0 * Math.PI;
    const magic = Math.sin(radLat);
    const sqrtMagic = Math.sqrt(1 - ee * magic * magic);
    
    const dLatFinal = (dLat * 180.0) / ((a * (1 - ee)) / (sqrtMagic * sqrtMagic * sqrtMagic) * Math.PI);
    const dLngFinal = (dLng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * Math.PI);
    
    // 应用更精确的偏移计算
    const gcjLat = lat + dLatFinal;
    const gcjLng = lng + dLngFinal;
    
    // 返回精确到8位小数的结果（约1.1毫米精度）
    return {
      latitude: Math.round(gcjLat * 100000000) / 100000000,
      longitude: Math.round(gcjLng * 100000000) / 100000000
    };
  }

  // 解析标签内容的辅助函数
  function getTagContent(xml, tagName, namespace = '') {
    const prefix = namespace ? namespace + ':' : '';
    const regex = new RegExp(`<${prefix}${tagName}[^>]*>(.*?)<\\/${prefix}${tagName}>`, 's');
    const match = regex.exec(xml);
    return match ? match[1] : '';
  }
  
  // 提取所有标签实例的辅助函数
  function getAllTags(xml, tagName, namespace = '') {
    const prefix = namespace ? namespace + ':' : '';
    const regex = new RegExp(`<${prefix}${tagName}([^>]*)>(.*?)<\\/${prefix}${tagName}>`, 'gs');
    const results = [];
    let match;
    
    while ((match = regex.exec(xml)) !== null) {
      // 解析属性
      const attrString = match[1];
      const attrRegex = /(\w+)="([^"]*)"/g;
      let attrMatch;
      const attrs = {};
      
      while ((attrMatch = attrRegex.exec(attrString)) !== null) {
        attrs[attrMatch[1]] = attrMatch[2];
      }
      
      results.push({
        attributes: attrs,
        content: match[2]
      });
    }
    
    return results;
  }
  
  // 提取CDATA内容的辅助函数
  function extractCDATA(text) {
    if (!text) return '';
    const match = /<!\[CDATA\[(.*?)\]\]>/s.exec(text);
    return match ? match[1] : text.trim();
  }
  
  // 解析坐标并从WGS-84转为GCJ-02
  function parseCoordinates(text) {
    if (!text || !text.trim()) return [];
    
    return text.trim().split(/\s+/).map(coord => {
      const parts = coord.split(',').map(parseFloat);
      
      // 原始WGS-84坐标
      const lng = parts[0] || 0;
      const lat = parts[1] || 0;
      const alt = parts.length > 2 ? parts[2] : 0;
      
      // 从WGS-84转换为GCJ-02
      const converted = wgs84ToGcj02(lng, lat);
      
      return {
        longitude: converted.longitude,
        latitude: converted.latitude,
        altitude: alt
      };
    });
  }
  
  // 解析gx:coord坐标并转换为GCJ-02
  function parseGxCoord(text) {
    if (!text || !text.trim()) return null;
    
    const parts = text.trim().split(/\s+/).map(parseFloat);
    
    // gx:coord通常是"经度 纬度 高度"格式
    if (parts.length >= 2) {
      const lng = parts[0] || 0;
      const lat = parts[1] || 0;
      const alt = parts.length > 2 ? parts[2] : 0;
      
      // 从WGS-84转换为GCJ-02
      const converted = wgs84ToGcj02(lng, lat);
      
      return {
        longitude: converted.longitude,
        latitude: converted.latitude,
        altitude: alt
      };
    }
    
    return null;
  }
  
  // 解析轨迹的扩展数据
  function parseTrackExtendedData(text) {
    if (!text || !text.trim()) return [];
    
    // 根据示例，数据似乎是以分号分隔的一系列值
    return text.trim().split(';').map(item => {
      const parts = item.split(',').map(parseFloat);
      
      // 根据示例，前面的值可能是速度或其他指标，后面是0.0
      return {
        value: parts[0] || 0,
        extra: parts.length > 1 ? parts[1] : 0
      };
    }).filter(item => !isNaN(item.value)); // 过滤掉无效值
  }
  
  // 主解析逻辑
  const result = {
    document: {
      id: '',
      name: '',
      styles: {},
      extendedData: {},
      folders: []
    }
  };
  
  // 提取文档
  const docContent = getTagContent(kmlString, 'Document');
  if (!docContent) return result;
  
  // 提取文档ID和名称
  const docMatch = /<Document[^>]*id="([^"]*)"/.exec(kmlString);
  result.document.id = docMatch ? docMatch[1] : '';
  result.document.name = extractCDATA(getTagContent(docContent, 'name'));
  
  // 提取样式
  const styles = getAllTags(docContent, 'Style');
  styles.forEach(({attributes, content}) => {
    if (!attributes.id) return;
    
    const style = { id: attributes.id };
    
    // 提取IconStyle
    const iconStyleContent = getTagContent(content, 'IconStyle');
    if (iconStyleContent) {
      const iconContent = getTagContent(iconStyleContent, 'Icon');
      if (iconContent) {
        style.iconHref = getTagContent(iconContent, 'href');
      }
    }
    
    // 提取LineStyle
    const lineStyleContent = getTagContent(content, 'LineStyle');
    if (lineStyleContent) {
      style.lineColor = getTagContent(lineStyleContent, 'color');
      const width = getTagContent(lineStyleContent, 'width');
      if (width) style.lineWidth = parseFloat(width);
    }
    
    // 提取LabelStyle
    const labelStyleContent = getTagContent(content, 'LabelStyle');
    if (labelStyleContent) {
      style.labelColor = getTagContent(labelStyleContent, 'color');
    }
    
    result.document.styles[attributes.id] = style;
  });
  
  // 提取StyleMaps
  const styleMaps = getAllTags(docContent, 'StyleMap');
  styleMaps.forEach(({attributes, content}) => {
    if (!attributes.id) return;
    
    const styleMap = { id: attributes.id, pairs: [] };
    
    // 提取Pairs
    const pairs = getAllTags(content, 'Pair');
    pairs.forEach(({content: pairContent}) => {
      const key = getTagContent(pairContent, 'key');
      const styleUrl = getTagContent(pairContent, 'styleUrl');
      
      if (key && styleUrl) {
        styleMap.pairs.push({ key: key.trim(), styleUrl: styleUrl.trim() });
      }
    });
    
    result.document.styles[attributes.id] = styleMap;
  });
  
  // 提取ExtendedData
  const extendedDataContent = getTagContent(docContent, 'ExtendedData');
  if (extendedDataContent) {
    const dataItems = getAllTags(extendedDataContent, 'Data');
    dataItems.forEach(({attributes, content}) => {
      if (!attributes.name) return;
      const value = extractCDATA(getTagContent(content, 'value'));
      result.document.extendedData[attributes.name] = value;
    });
  }
  
  // 提取Folders
  const folders = getAllTags(docContent, 'Folder');
  folders.forEach(({attributes, content}) => {
    const folder = {
      id: attributes.id || '',
      name: extractCDATA(getTagContent(content, 'name')),
      placemarks: []
    };
    
    // 提取Placemarks
    const placemarks = getAllTags(content, 'Placemark');
    placemarks.forEach(({attributes: placemarkAttrs, content: placemarkContent}) => {
      const placemark = {
        id: placemarkAttrs.id || '',
        name: extractCDATA(getTagContent(placemarkContent, 'name')),
        description: extractCDATA(getTagContent(placemarkContent, 'description')),
        styleUrl: getTagContent(placemarkContent, 'styleUrl')
      };
      
      // 提取Point几何数据
      const pointContent = getTagContent(placemarkContent, 'Point');
      if (pointContent) {
        const coordsText = getTagContent(pointContent, 'coordinates');
        const coords = parseCoordinates(coordsText);
        
        if (coords.length > 0) {
          placemark.geometry = {
            type: 'Point',
            coordinates: coords[0]
          };
        }
      }
      
      // 提取LineString几何数据
      const lineStringContent = getTagContent(placemarkContent, 'LineString');
      if (lineStringContent) {
        const coordsText = getTagContent(lineStringContent, 'coordinates');
        placemark.geometry = {
          type: 'LineString',
          coordinates: parseCoordinates(coordsText)
        };
      }
      
      // 提取gx:Track数据
      const gxTrackContent = getTagContent(placemarkContent, 'Track', 'gx');
      if (gxTrackContent) {
        // 提取gx:coord坐标
        const gxCoords = getAllTags(gxTrackContent, 'coord', 'gx');
        const coordinates = gxCoords.map(({content}) => parseGxCoord(content)).filter(coord => coord !== null);
        
        // 提取Track的ExtendedData
        const trackExtendedDataContent = getTagContent(gxTrackContent, 'ExtendedData');
        let extendedDataValues = [];
        
        if (trackExtendedDataContent) {
          const dataItems = getAllTags(trackExtendedDataContent, 'Data');
          dataItems.forEach(({attributes, content}) => {
            if (attributes.name === 'GxTrackExtendedData') {
              const valueContent = getTagContent(content, 'value');
              extendedDataValues = parseTrackExtendedData(valueContent);
            }
          });
        }
        
        placemark.geometry = {
          type: 'Track',
          coordinates: coordinates,
          extendedData: extendedDataValues
        };
      }
      
      folder.placemarks.push(placemark);
    });
    
    result.document.folders.push(folder);
  });
  
  return result;
}

export default parseKML;