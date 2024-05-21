'use client';
import { useState } from 'react';
import { remark } from 'remark';
import html from 'remark-html';

const DropdownItem = ({ title, markdownFile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const toggleDropdown = async () => {
    if (!isOpen && !content) {
      try {
        const res = await fetch(`/api/markdown?markdownFile=${markdownFile}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch markdown: ${res.statusText}`);
        }
        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }
        const processedContent = await remark().use(html).process(data.content);
        setContent(processedContent.toString());
      } catch (error) {
        setError(error.message);
      }
    }
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ borderBottom: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
      <div onClick={toggleDropdown} style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer', alignItems: 'center' }}>
        <span className="font-outfit-bold font-outfit-italic title-font-size">{title}</span>
        <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s', display: 'flex', alignItems: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
      {isOpen && (
        <div style={{ padding: '10px 0' }}>
          {error ? (
            <div style={{ color: 'red' }}>Error: {error}</div>
          ) : (
            <div className="markdown-content" dangerouslySetInnerHTML={{ __html: content }}></div>
          )}
        </div>
      )}
    </div>
  );
};

export default DropdownItem;
