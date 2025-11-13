import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SubmitPage.css';

const SubmitPage: React.FC = () => {
  const navigate = useNavigate();
  const [submitter, setSubmitter] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    doi: '',
    abstract: '',
    journal: '',
    year: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.name.endsWith('.bib')) {
        setFile(selectedFile);
        setErrors((prev) => ({ ...prev, file: '' }));
      } else {
        setErrors((prev) => ({ ...prev, file: '仅支持 .bib 格式文件' }));
        setFile(null);
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!submitter.trim()) newErrors.submitter = '提交者姓名不能为空';
    if (!formData.title.trim()) newErrors.title = '标题不能为空';
    if (!formData.authors.trim()) newErrors.authors = '作者不能为空';
    if (!formData.doi.trim()) newErrors.doi = 'DOI 不能为空';
    if (!file) newErrors.file = '请选择 BibTeX 文件';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage('');

    try {
      const form = new FormData();
      form.append('bibtexFile', file as File);
      form.append('submitter', submitter.trim());
      form.append('title', formData.title);
      form.append('authors', formData.authors);
      form.append('doi', formData.doi);
      form.append('abstract', formData.abstract);
      form.append('journal', formData.journal);
      form.append('year', formData.year);

      await axios.post('http://localhost:3001/api/papers/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage('文献提交成功！');
      resetForm();
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setMessage('提交失败，请重试');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
  setSubmitter('');
  setFormData({
    title: '',
    authors: '',
    doi: '',
    abstract: '',
    journal: '',
    year: '',
  });
  setFile(null);
  // 修复可选链赋值和类型断言问题
  const fileInput = document.getElementById('fileInput') as HTMLInputElement | null;
  if (fileInput) fileInput.value = '';
};

  return (
    <div className="submit-page">
      <h1>提交文献</h1>
      {message && <div className={`message ${message.includes('成功') ? 'success' : 'error'}`}>{message}</div>}
      <form onSubmit={handleSubmit} className="submit-form">
        <div className="form-group">
          <label htmlFor="submitter">提交者姓名 <span className="required">*</span></label>
          <input
            type="text"
            id="submitter"
            name="submitter"
            value={submitter}
            onChange={(e) => setSubmitter(e.target.value)}
            className={errors.submitter ? 'invalid' : ''}
            placeholder="请输入您的姓名"
          />
          {errors.submitter && <span className="error">{errors.submitter}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="title">标题 <span className="required">*</span></label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={errors.title ? 'invalid' : ''}
            placeholder="请输入文献标题"
          />
          {errors.title && <span className="error">{errors.title}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="authors">作者 <span className="required">*</span></label>
          <input
            type="text"
            id="authors"
            name="authors"
            value={formData.authors}
            onChange={handleInputChange}
            className={errors.authors ? 'invalid' : ''}
            placeholder="请输入作者（多个作者用逗号分隔）"
          />
          {errors.authors && <span className="error">{errors.authors}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="doi">DOI <span className="required">*</span></label>
          <input
            type="text"
            id="doi"
            name="doi"
            value={formData.doi}
            onChange={handleInputChange}
            className={errors.doi ? 'invalid' : ''}
            placeholder="请输入文献 DOI（如 10.1234/abcd）"
          />
          {errors.doi && <span className="error">{errors.doi}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="abstract">摘要</label>
          <textarea
            id="abstract"
            name="abstract"
            value={formData.abstract}
            onChange={handleInputChange}
            placeholder="请输入文献摘要"
            rows={4}
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="journal">期刊</label>
          <input
            type="text"
            id="journal"
            name="journal"
            value={formData.journal}
            onChange={handleInputChange}
            placeholder="请输入发表期刊"
          />
        </div>
        <div className="form-group">
          <label htmlFor="year">发表年份</label>
          <input
            type="text"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            placeholder="请输入发表年份"
          />
        </div>
        <div className="form-group">
          <label htmlFor="fileInput">BibTeX 文件 <span className="required">*</span></label>
          <input
            type="file"
            id="fileInput"
            name="fileInput"
            onChange={handleFileChange}
            accept=".bib"
          />
          {errors.file && <span className="error">{errors.file}</span>}
        </div>
        <div className="form-actions">
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? '提交中...' : '提交文献'}
          </button>
          <button type="button" onClick={resetForm} className="reset-btn">
            重置表单
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmitPage;