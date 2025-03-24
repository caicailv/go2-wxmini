function parseKML(kmlString) {
  // Helper function to extract content between tags
  function getTagContent(xml, tagName) {
    const regex = new RegExp(`<${tagName}[^>]*>(.*?)<\\/${tagName}>`, 's');
    const match = regex.exec(xml);
    return match ? match[1] : '';
  }
  
  // Helper function to extract all occurrences of a tag
  function getAllTags(xml, tagName) {
    const regex = new RegExp(`<${tagName}([^>]*)>(.*?)<\\/${tagName}>`, 'gs');
    const results = [];
    let match;
    
    while ((match = regex.exec(xml)) !== null) {
      // Parse attributes
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
  
  // Helper function to extract CDATA content
  function extractCDATA(text) {
    if (!text) return '';
    const match = /<!\[CDATA\[(.*?)\]\]>/s.exec(text);
    return match ? match[1] : text.trim();
  }
  
  // Helper function to parse coordinates
  function parseCoordinates(text) {
    if (!text || !text.trim()) return [];
    
    return text.trim().split(/\s+/).map(coord => {
      const parts = coord.split(',').map(parseFloat);
      return {
        longitude: parts[0] || 0,
        latitude: parts[1] || 0,
        altitude: parts.length > 2 ? parts[2] : 0
      };
    });
  }
  
  // Main parsing logic
  const result = {
    document: {
      id: '',
      name: '',
      styles: {},
      extendedData: {},
      folders: []
    }
  };
  
  // Extract document
  const docContent = getTagContent(kmlString, 'Document');
  if (!docContent) return result;
  
  // Extract document ID and name
  const docMatch = /<Document[^>]*id="([^"]*)"/.exec(kmlString);
  result.document.id = docMatch ? docMatch[1] : '';
  result.document.name = extractCDATA(getTagContent(docContent, 'name'));
  
  // Extract styles
  const styles = getAllTags(docContent, 'Style');
  styles.forEach(({attributes, content}) => {
    if (!attributes.id) return;
    
    const style = { id: attributes.id };
    
    // Extract IconStyle
    const iconStyleContent = getTagContent(content, 'IconStyle');
    if (iconStyleContent) {
      const iconContent = getTagContent(iconStyleContent, 'Icon');
      if (iconContent) {
        style.iconHref = getTagContent(iconContent, 'href');
      }
    }
    
    // Extract LineStyle
    const lineStyleContent = getTagContent(content, 'LineStyle');
    if (lineStyleContent) {
      style.lineColor = getTagContent(lineStyleContent, 'color');
      const width = getTagContent(lineStyleContent, 'width');
      if (width) style.lineWidth = parseFloat(width);
    }
    
    // Extract LabelStyle
    const labelStyleContent = getTagContent(content, 'LabelStyle');
    if (labelStyleContent) {
      style.labelColor = getTagContent(labelStyleContent, 'color');
    }
    
    result.document.styles[attributes.id] = style;
  });
  
  // Extract StyleMaps
  const styleMaps = getAllTags(docContent, 'StyleMap');
  styleMaps.forEach(({attributes, content}) => {
    if (!attributes.id) return;
    
    const styleMap = { id: attributes.id, pairs: [] };
    
    // Extract Pairs
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
  
  // Extract ExtendedData
  const extendedDataContent = getTagContent(docContent, 'ExtendedData');
  if (extendedDataContent) {
    const dataItems = getAllTags(extendedDataContent, 'Data');
    dataItems.forEach(({attributes, content}) => {
      if (!attributes.name) return;
      const value = extractCDATA(getTagContent(content, 'value'));
      result.document.extendedData[attributes.name] = value;
    });
  }
  
  // Extract Folders
  const folders = getAllTags(docContent, 'Folder');
  folders.forEach(({attributes, content}) => {
    if (!attributes.id) return;
    
    const folder = {
      id: attributes.id,
      name: extractCDATA(getTagContent(content, 'name')),
      placemarks: []
    };
    
    // Extract Placemarks
    const placemarks = getAllTags(content, 'Placemark');
    placemarks.forEach(({attributes: placemarkAttrs, content: placemarkContent}) => {
      const placemark = {
        id: placemarkAttrs.id || '',
        name: extractCDATA(getTagContent(placemarkContent, 'name')),
        description: extractCDATA(getTagContent(placemarkContent, 'description')),
        styleUrl: getTagContent(placemarkContent, 'styleUrl')
      };
      
      // Extract Point geometry
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
      
      // Extract LineString geometry
      const lineStringContent = getTagContent(placemarkContent, 'LineString');
      if (lineStringContent) {
        const coordsText = getTagContent(lineStringContent, 'coordinates');
        placemark.geometry = {
          type: 'LineString',
          coordinates: parseCoordinates(coordsText)
        };
      }
      
      folder.placemarks.push(placemark);
    });
    
    result.document.folders.push(folder);
  });
  
  return result;
}
export default parseKML;
