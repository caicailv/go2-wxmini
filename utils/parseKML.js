function parseXML(xmlString) {
  // 移除XML声明和CDATA
  xmlString = xmlString.replace(/<\?xml.*\?>/g, '');
  xmlString = xmlString.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1');
  
  return new Promise((resolve) => {
    const result = {
      name: '',
      extendedData: {},
      points: {
        start: null,
        end: null
      },
      navigation: []
    };

    try {
      // 使用小程序原生XML解析
      let parseResult = wx.convertXMLToObj(xmlString); // 微信小程序
      // 如果是uniapp，使用下面的方式
      // let parseResult = uni.parseXML(xmlString);

      if (parseResult && parseResult.kml && parseResult.kml.Document) {
        const doc = parseResult.kml.Document;
        
        // 解析名称
        result.name = doc.name || '';

        // 解析ExtendedData
        if (doc.ExtendedData && doc.ExtendedData.Data) {
          const dataArray = Array.isArray(doc.ExtendedData.Data)  
            ? doc.ExtendedData.Data 
            : [doc.ExtendedData.Data];
            
          dataArray.forEach(data => {
            if (data.name && data.value) {
              result.extendedData[data.name] = data.value;
            }
          });
        }

        // 解析点位
        if (doc.Folder) {
          const folders = Array.isArray(doc.Folder) ? doc.Folder : [doc.Folder];
          folders.forEach(folder => {
            if (folder.Placemark) {
              const placemarks = Array.isArray(folder.Placemark) 
                ? folder.Placemark 
                : [folder.Placemark];
                
              placemarks.forEach(placemark => {
                if (placemark.Point && placemark.Point.coordinates) {
                  const coords = placemark.Point.coordinates.split(',').map(Number);
                  if (placemark.id === 'startPoint') {
                    result.points.start = {
                      longitude: coords[0],
                      latitude: coords[1],
                      altitude: coords[2]
                    };
                  } else if (placemark.id === 'endPoint') {
                    result.points.end = {
                      longitude: coords[0],
                      latitude: coords[1],
                      altitude: coords[2]
                    };
                  }
                }
              });
            }
          });
        }
      }
      
      resolve(result);
    } catch (error) {
      console.error('XML解析错误:', error);
      resolve(result); // 返回空结果
    }
  });
}

export default parseXML;
