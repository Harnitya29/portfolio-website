"use client";

import { useEffect } from "react";
import mermaid from "mermaid";

export default function MermaidInitializer() {
  useEffect(() => {
    // Cấu hình mermaid với theme tối và các tùy chỉnh
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis',
        nodeSpacing: 50,
        rankSpacing: 50,
        padding: 15,
        // boxMargin: 10, // This property doesn't exist in the current mermaid version
        // boxTextMargin: 5, // This property doesn't exist in the current mermaid version
        // noteMargin: 10, // This property doesn't exist in the current mermaid version
        // messageMargin: 35, // This property doesn't exist in the current mermaid version
      }
    });

    // Tìm và render tất cả các diagram mermaid
    const renderMermaid = () => {
      try {
        mermaid.init(undefined, document.querySelectorAll(".mermaid"));
        
        // Áp dụng style cho các node sau khi render
        setTimeout(() => {
          // Áp dụng style cho tất cả các node
          document.querySelectorAll('.node rect, .node polygon, .node circle, .node ellipse').forEach(node => {
            node.setAttribute('fill', '#ffffff');
            node.setAttribute('stroke', '#333333');
            node.setAttribute('stroke-width', '1px');
          });
          
          // Áp dụng style cho các node cụ thể
          document.querySelectorAll('.node.B rect, .node.B polygon').forEach(node => {
            node.setAttribute('fill', '#ff99cc'); // Màu hồng như trong hình
            node.setAttribute('stroke', '#333333');
            node.setAttribute('stroke-width', '1px');
          });
          
          document.querySelectorAll('.node.E rect, .node.E polygon').forEach(node => {
            node.setAttribute('fill', '#ccccff'); // Màu tím nhạt như trong hình
            node.setAttribute('stroke', '#333333');
            node.setAttribute('stroke-width', '1px');
          });
          
          document.querySelectorAll('.node.F rect, .node.F polygon').forEach(node => {
            node.setAttribute('fill', '#ccffcc'); // Màu xanh lá nhạt như trong hình
            node.setAttribute('stroke', '#333333');
            node.setAttribute('stroke-width', '1px');
          });
          
          // Áp dụng style cho các đường nối
          document.querySelectorAll('.edgePath .path').forEach(path => {
            path.setAttribute('stroke', '#00ff99'); // Màu xanh lá cho các đường nối
            path.setAttribute('stroke-width', '1.5px');
          });
          
          // Áp dụng style cho các label
          document.querySelectorAll('.edgeLabel').forEach(label => {
            const labelBg = label.querySelector('rect');
            if (labelBg) {
              labelBg.setAttribute('fill', 'transparent');
            }
          });
          
          document.querySelectorAll('.label').forEach(label => {
            if (label.tagName === 'g') {
              const foreignObject = label.querySelector('foreignObject');
              if (foreignObject) {
                const div = foreignObject.querySelector('div');
                if (div) {
                  div.style.color = '#000000';
                  div.style.fontFamily = "'JetBrains Mono', 'Fira Code', 'Roboto Mono', monospace";
                }
              }
            }
          });
        }, 200);
      } catch (error) {
        console.error("Mermaid initialization failed:", error);
      }
    };

    // Render lần đầu
    renderMermaid();

    // Render lại khi DOM thay đổi
    const observer = new MutationObserver((mutations) => {
      let shouldRender = false;
      mutations.forEach((mutation) => {
        if (mutation.type === "childList" && 
            Array.from(mutation.addedNodes).some(node => 
              node.nodeType === 1 && 
              ((node as Element).classList?.contains('mermaid') || 
               (node as Element).querySelector?.('.mermaid'))
            )) {
          shouldRender = true;
        }
      });
      
      if (shouldRender) {
        renderMermaid();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}