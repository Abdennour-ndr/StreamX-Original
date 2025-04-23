'use client';

import { useState, useEffect } from 'react';
import { Container, Title, Code, Alert, Button, Text } from '@mantine/core';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function TestPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

  const testConnection = async () => {
    try {
      addLog('بدء اختبار الاتصال...');
      
      // التحقق من وجود db
      if (!db) {
        throw new Error('لم يتم تهيئة Firestore');
      }
      addLog('تم العثور على كائن db');

      // محاولة قراءة مستند معين
      addLog('محاولة قراءة مستند معين...');
      const testDoc = doc(db, 'test', 'test');
      const docSnap = await getDoc(testDoc);
      
      if (docSnap.exists()) {
        addLog(`تم العثور على المستند: ${JSON.stringify(docSnap.data())}`);
      } else {
        addLog('المستند غير موجود، محاولة إنشائه...');
        // هنا يمكنك إضافة كود لإنشاء المستند إذا أردت
      }

      // محاولة قراءة مجموعة المستخدمين
      addLog('محاولة قراءة مجموعة users...');
      const usersRef = collection(db, 'users');
      const usersSnap = await getDocs(usersRef);
      
      addLog(`عدد المستخدمين: ${usersSnap.size}`);
      usersSnap.forEach(doc => {
        addLog(`مستخدم: ${doc.id} - ${JSON.stringify(doc.data())}`);
      });

      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ غير معروف';
      addLog(`حدث خطأ: ${errorMessage}`);
      setError(errorMessage);
      console.error('تفاصيل الخطأ:', err);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <Container size="xl" py="xl">
      <Title order={2} mb="xl">صفحة اختبار الاتصال</Title>

      {error && (
        <Alert color="red" mb="xl">
          <Text fw={700}>خطأ:</Text>
          <Text>{error}</Text>
        </Alert>
      )}

      <Button onClick={testConnection} mb="xl">
        إعادة المحاولة
      </Button>

      <Title order={3} mb="md">سجل التشغيل:</Title>
      <Code block style={{ maxHeight: '500px', overflow: 'auto' }}>
        {logs.join('\n')}
      </Code>
    </Container>
  );
} 