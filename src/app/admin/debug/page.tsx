'use client';

import { useState, useEffect } from 'react';
import { Container, Title, Code, Alert, Button, Text } from '@mantine/core';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const addDebugInfo = (info: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toISOString()}: ${info}`]);
  };

  const testFirestoreConnection = async () => {
    try {
      addDebugInfo('بدء اختبار الاتصال بـ Firestore...');
      
      // التحقق من وجود كائن db
      if (!db) {
        throw new Error('لم يتم تهيئة Firestore (db is undefined)');
      }
      addDebugInfo('تم العثور على كائن db');

      // محاولة الوصول إلى مجموعة المستخدمين
      addDebugInfo('محاولة الوصول إلى مجموعة users...');
      const usersRef = collection(db, 'users');
      addDebugInfo('تم إنشاء مرجع المجموعة');

      // محاولة جلب المستندات
      addDebugInfo('محاولة جلب المستندات...');
      const snapshot = await getDocs(usersRef);
      addDebugInfo(`تم جلب ${snapshot.size} مستند`);

      // عرض بيانات المستندات
      snapshot.forEach(doc => {
        addDebugInfo(`مستند: ${doc.id} - ${JSON.stringify(doc.data())}`);
      });

      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ غير معروف';
      addDebugInfo(`حدث خطأ: ${errorMessage}`);
      setError(errorMessage);
      console.error('تفاصيل الخطأ:', err);
    }
  };

  useEffect(() => {
    testFirestoreConnection();
  }, []);

  return (
    <Container size="xl" py="xl">
      <Title order={2} mb="xl">صفحة التحقق من الأخطاء</Title>

      {error && (
        <Alert color="red" mb="xl">
          <Text weight={700}>خطأ:</Text>
          <Text>{error}</Text>
        </Alert>
      )}

      <Button onClick={testFirestoreConnection} mb="xl">
        إعادة المحاولة
      </Button>

      <Title order={3} mb="md">سجل التشغيل:</Title>
      <Code block style={{ maxHeight: '500px', overflow: 'auto' }}>
        {debugInfo.join('\n')}
      </Code>
    </Container>
  );
} 