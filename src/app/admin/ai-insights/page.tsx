'use client';

import { useEffect, useState } from 'react';
import { 
  Card, 
  Text, 
  Group, 
  Stack, 
  Title, 
  Badge, 
  Grid, 
  Button, 
  Progress,
  RingProgress,
  Tabs,
  Paper,
  ActionIcon,
  TextInput
} from '@mantine/core';
import { 
  IconBrain, 
  IconChartLine, 
  IconMessage, 
  IconTrendingUp, 
  IconTrendingDown,
  IconEye,
  IconUsers,
  IconMovie,
  IconStar,
  IconRobot,
  IconRefresh,
  IconSend
} from '@tabler/icons-react';

interface PredictionData {
  month: string;
  users: number;
  views: number;
  prediction: boolean;
}

interface SentimentData {
  positive: number;
  neutral: number;
  negative: number;
  keywords: string[];
}

interface MovieRecommendation {
  id: string;
  title: string;
  score: number;
  reason: string;
}

export default function AIInsightsPage() {
  const [loading, setLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'assistant'; content: string}[]>([
    {role: 'assistant', content: 'مرحبًا، أنا مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟'}
  ]);
  const [userMessage, setUserMessage] = useState('');
  
  // بيانات تجريبية - في التطبيق الحقيقي ستأتي من API
  const predictionData: PredictionData[] = [
    { month: 'يناير', users: 1200, views: 45000, prediction: false },
    { month: 'فبراير', users: 1400, views: 52000, prediction: false },
    { month: 'مارس', users: 1350, views: 48000, prediction: false },
    { month: 'أبريل', users: 1500, views: 55000, prediction: false },
    { month: 'مايو', users: 1650, views: 60000, prediction: false },
    { month: 'يونيو', users: 1800, views: 65000, prediction: true },
    { month: 'يوليو', users: 2000, views: 72000, prediction: true },
    { month: 'أغسطس', users: 2200, views: 78000, prediction: true }
  ];

  const sentimentData: SentimentData = {
    positive: 65,
    neutral: 20,
    negative: 15,
    keywords: ['جودة عالية', 'سهل الاستخدام', 'سرعة التحميل', 'محتوى متنوع']
  };

  const recommendations: MovieRecommendation[] = [
    { 
      id: '1', 
      title: 'الفيلم الجديد', 
      score: 92, 
      reason: 'يتوافق مع اهتمامات 85% من المستخدمين النشطين' 
    },
    { 
      id: '2', 
      title: 'المسلسل الشهير', 
      score: 88, 
      reason: 'محبوب بين الفئة العمرية الأكثر نشاطاً على المنصة' 
    },
    { 
      id: '3', 
      title: 'الوثائقي المميز', 
      score: 75, 
      reason: 'يعالج موضوعاً مطلوباً حسب تحليل البحث' 
    }
  ];

  useEffect(() => {
    // محاكاة طلب بيانات
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = () => {
    if (!userMessage.trim()) return;
    
    // إضافة رسالة المستخدم
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    // محاكاة رد المساعد الذكي
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: `شكراً على سؤالك. بناءً على تحليل البيانات، يمكنني أن أقترح تحسين المحتوى في فئة "${userMessage}" لزيادة نسبة المشاهدة بنسبة 12% خلال الشهر القادم.` 
        }
      ]);
    }, 1000);
    
    setUserMessage('');
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Text size="xl">جاري تحليل البيانات...</Text>
      </div>
    );
  }

  const PredictionChart = () => (
    <Card withBorder p="xl" radius="md" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
      <Group justify="space-between" mb="xl">
        <div>
          <Text size="lg" fw={500}>التنبؤ بنمو المنصة</Text>
          <Text size="xs" c="dimmed">
            تحليل وتوقعات لـ 3 أشهر قادمة بناءً على نماذج تعلم الآلة
          </Text>
        </div>
        <Badge size="lg" color="indigo" leftSection={<IconBrain size={16} />}>
          تحليل ذكي
        </Badge>
      </Group>

      <Stack gap="md">
        <div>
          <Group justify="space-between" mb="xs">
            <Text size="sm" fw={500}>توقعات المستخدمين الجدد</Text>
            <Badge color="green">+22% متوقع</Badge>
          </Group>
          <div style={{ height: '40px', position: 'relative' }}>
            {predictionData.map((data, index) => (
              <div 
                key={index} 
                style={{ 
                  position: 'absolute',
                  left: `${index * (100 / (predictionData.length - 1))}%`,
                  bottom: 0,
                  width: '8px',
                  height: `${(data.users / 2500) * 100}%`,
                  backgroundColor: data.prediction ? 'rgba(51, 154, 240, 0.5)' : 'rgba(51, 154, 240, 1)',
                  borderRadius: '2px',
                  transform: 'translateX(-50%)'
                }}
              />
            ))}
          </div>
          <Group mt="xs" justify="space-between">
            {predictionData.map((data, index) => (
              <Text 
                key={index} 
                size="xs" 
                c="dimmed"
                style={{ 
                  width: `${100 / predictionData.length}%`, 
                  textAlign: 'center',
                  opacity: data.prediction ? 0.7 : 1
                }}
              >
                {data.month}
              </Text>
            ))}
          </Group>
        </div>

        <div>
          <Group justify="space-between" mb="xs">
            <Text size="sm" fw={500}>توقعات المشاهدات</Text>
            <Badge color="green">+20% متوقع</Badge>
          </Group>
          <div style={{ height: '40px', position: 'relative' }}>
            {predictionData.map((data, index) => (
              <div 
                key={index} 
                style={{ 
                  position: 'absolute',
                  left: `${index * (100 / (predictionData.length - 1))}%`,
                  bottom: 0,
                  width: '8px',
                  height: `${(data.views / 90000) * 100}%`,
                  backgroundColor: data.prediction ? 'rgba(99, 230, 190, 0.5)' : 'rgba(99, 230, 190, 1)',
                  borderRadius: '2px',
                  transform: 'translateX(-50%)'
                }}
              />
            ))}
          </div>
          <Group mt="xs" justify="space-between">
            {predictionData.map((data, index) => (
              <Text 
                key={index} 
                size="xs" 
                c="dimmed"
                style={{ 
                  width: `${100 / predictionData.length}%`, 
                  textAlign: 'center',
                  opacity: data.prediction ? 0.7 : 1
                }}
              >
                {data.month}
              </Text>
            ))}
          </Group>
        </div>
        
        <Button 
          mt="md" 
          variant="light" 
          color="blue" 
          leftSection={<IconRefresh size={16} />}
        >
          تحديث التوقعات
        </Button>
      </Stack>
    </Card>
  );

  const SentimentAnalysis = () => (
    <Card withBorder p="xl" radius="md" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
      <Group justify="space-between" mb="xl">
        <div>
          <Text size="lg" fw={500}>تحليل مشاعر المستخدمين</Text>
          <Text size="xs" c="dimmed">
            تحليل آراء المستخدمين باستخدام معالجة اللغة الطبيعية
          </Text>
        </div>
        <Badge size="lg" color="green" leftSection={<IconMessage size={16} />}>
          معالجة لغة
        </Badge>
      </Group>

      <Grid>
        <Grid.Col span={5}>
          <RingProgress
            size={200}
            thickness={20}
            roundCaps
            sections={[
              { value: sentimentData.positive, color: 'green' },
              { value: sentimentData.neutral, color: 'gray' },
              { value: sentimentData.negative, color: 'red' },
            ]}
            label={
              <div style={{ textAlign: 'center' }}>
                <Text size="xl" fw={700} c="green">{sentimentData.positive}%</Text>
                <Text size="xs" c="dimmed">إيجابي</Text>
              </div>
            }
          />
        </Grid.Col>
        <Grid.Col span={7}>
          <Stack>
            <div>
              <Group justify="space-between" mb={5}>
                <Text size="sm">إيجابي</Text>
                <Text size="sm" c="green">{sentimentData.positive}%</Text>
              </Group>
              <Progress value={sentimentData.positive} color="green" />
            </div>
            <div>
              <Group justify="space-between" mb={5}>
                <Text size="sm">محايد</Text>
                <Text size="sm" c="gray">{sentimentData.neutral}%</Text>
              </Group>
              <Progress value={sentimentData.neutral} color="gray" />
            </div>
            <div>
              <Group justify="space-between" mb={5}>
                <Text size="sm">سلبي</Text>
                <Text size="sm" c="red">{sentimentData.negative}%</Text>
              </Group>
              <Progress value={sentimentData.negative} color="red" />
            </div>

            <Text size="sm" fw={500} mt="md">الكلمات الإيجابية الأكثر تكراراً:</Text>
            <Group>
              {sentimentData.keywords.map((keyword, index) => (
                <Badge key={index} color="green">{keyword}</Badge>
              ))}
            </Group>
          </Stack>
        </Grid.Col>
      </Grid>
    </Card>
  );

  const ContentRecommendations = () => (
    <Card withBorder p="xl" radius="md" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
      <Group justify="space-between" mb="xl">
        <div>
          <Text size="lg" fw={500}>توصيات المحتوى الذكية</Text>
          <Text size="xs" c="dimmed">
            اقتراحات محتوى للترويج بناءً على بيانات المستخدمين
          </Text>
        </div>
        <Badge size="lg" color="violet" leftSection={<IconStar size={16} />}>
          توصيات
        </Badge>
      </Group>

      <Stack gap="md">
        {recommendations.map((rec) => (
          <Paper key={rec.id} withBorder p="md">
            <Group justify="space-between">
              <div>
                <Group>
                  <IconMovie size={20} color="#7048e8" />
                  <Text fw={500}>{rec.title}</Text>
                </Group>
                <Text size="xs" c="dimmed" mt={5}>{rec.reason}</Text>
              </div>
              <Badge size="xl" color={rec.score > 85 ? 'green' : rec.score > 70 ? 'yellow' : 'orange'}>
                {rec.score}%
              </Badge>
            </Group>
          </Paper>
        ))}

        <Button 
          mt="sm" 
          variant="light" 
          color="violet"
        >
          عرض المزيد من التوصيات
        </Button>
      </Stack>
    </Card>
  );

  const AIAssistant = () => (
    <Card withBorder p="xl" radius="md" h="100%" style={{ background: 'rgba(255, 255, 255, 0.05)', display: 'flex', flexDirection: 'column' }}>
      <Group justify="space-between" mb="md">
        <div>
          <Text size="lg" fw={500}>المساعد الذكي</Text>
          <Text size="xs" c="dimmed">
            اسأل عن إحصائيات أو توصيات لتحسين المنصة
          </Text>
        </div>
        <Badge size="lg" color="cyan" leftSection={<IconRobot size={16} />}>
          شات ذكي
        </Badge>
      </Group>

      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: '300px',
        maxHeight: '400px',
        overflow: 'hidden',
      }}>
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '10px',
          background: 'rgba(0,0,0,0.1)',
          borderRadius: '8px',
          marginBottom: '10px'
        }}>
          {chatMessages.map((msg, index) => (
            <div 
              key={index} 
              style={{ 
                marginBottom: '10px',
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-start' : 'flex-end',
              }}
            >
              <div style={{ 
                background: msg.role === 'user' ? 'rgba(0,0,0,0.2)' : 'rgba(25,113,194,0.2)',
                borderRadius: '12px',
                padding: '10px 15px',
                maxWidth: '80%',
              }}>
                <Text size="sm">{msg.content}</Text>
              </div>
            </div>
          ))}
        </div>

        <Group>
          <TextInput
            placeholder="اسأل المساعد الذكي..."
            style={{ flex: 1 }}
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <ActionIcon 
            color="blue" 
            variant="filled" 
            onClick={handleSendMessage}
            size="lg"
          >
            <IconSend size={18} />
          </ActionIcon>
        </Group>
      </div>
    </Card>
  );

  return (
    <Stack gap="xl">
      <Group justify="space-between">
        <div>
          <Title order={2}>رؤى الذكاء الاصطناعي</Title>
          <Text c="dimmed">تحليلات متقدمة وتوقعات ذكية لتحسين الأداء</Text>
        </div>
        <Button 
          variant="light" 
          color="indigo" 
          leftSection={<IconBrain size={20} />}
        >
          تحديث التحليلات
        </Button>
      </Group>

      <Tabs defaultValue="predictions" variant="outline">
        <Tabs.List mb="md">
          <Tabs.Tab 
            value="predictions" 
            leftSection={<IconChartLine size={16} />}
          >
            التنبؤات
          </Tabs.Tab>
          <Tabs.Tab 
            value="sentiments" 
            leftSection={<IconMessage size={16} />}
          >
            تحليل المشاعر
          </Tabs.Tab>
          <Tabs.Tab 
            value="recommendations" 
            leftSection={<IconStar size={16} />}
          >
            التوصيات
          </Tabs.Tab>
          <Tabs.Tab 
            value="assistant" 
            leftSection={<IconRobot size={16} />}
          >
            المساعد الذكي
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="predictions">
          <Grid>
            <Grid.Col span={12}>
              <PredictionChart />
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="sentiments">
          <Grid>
            <Grid.Col span={12}>
              <SentimentAnalysis />
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="recommendations">
          <Grid>
            <Grid.Col span={12}>
              <ContentRecommendations />
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="assistant">
          <Grid>
            <Grid.Col span={12}>
              <AIAssistant />
            </Grid.Col>
          </Grid>
        </Tabs.Panel>
      </Tabs>

      <Grid>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder p="xl" radius="md" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <Text size="lg" fw={500} mb="md">سلوك المستخدمين</Text>
            <RingProgress
              size={150}
              thickness={16}
              roundCaps
              sections={[
                { value: 40, color: 'blue' },
                { value: 30, color: 'green' },
                { value: 20, color: 'orange' },
                { value: 10, color: 'red' },
              ]}
              label={
                <div style={{ textAlign: 'center' }}>
                  <IconEye size={20} />
                  <Text size="xs" mt={5}>نشاط</Text>
                </div>
              }
            />
            <Stack mt="md">
              <Group justify="space-between">
                <Group gap={5}>
                  <div style={{ width: 12, height: 12, background: 'blue', borderRadius: '50%' }} />
                  <Text size="xs">مشاهدة أفلام</Text>
                </Group>
                <Text size="xs" fw={500}>40%</Text>
              </Group>
              <Group justify="space-between">
                <Group gap={5}>
                  <div style={{ width: 12, height: 12, background: 'green', borderRadius: '50%' }} />
                  <Text size="xs">تصفح</Text>
                </Group>
                <Text size="xs" fw={500}>30%</Text>
              </Group>
              <Group justify="space-between">
                <Group gap={5}>
                  <div style={{ width: 12, height: 12, background: 'orange', borderRadius: '50%' }} />
                  <Text size="xs">البحث</Text>
                </Group>
                <Text size="xs" fw={500}>20%</Text>
              </Group>
              <Group justify="space-between">
                <Group gap={5}>
                  <div style={{ width: 12, height: 12, background: 'red', borderRadius: '50%' }} />
                  <Text size="xs">الإعدادات</Text>
                </Group>
                <Text size="xs" fw={500}>10%</Text>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card withBorder p="xl" radius="md" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <Text size="lg" fw={500} mb="md">توصيات ذكية للتحسين</Text>
            <Stack>
              <Paper p="md" withBorder>
                <Group gap="sm">
                  <Badge color="green" size="lg" variant="filled">
                    <IconTrendingUp size={14} style={{ marginLeft: 5 }} />
                    تحسين
                  </Badge>
                  <Text fw={500}>زيادة المحتوى في فئة "أفلام الحركة" بنسبة 15%</Text>
                </Group>
                <Text size="xs" c="dimmed" mt={5}>
                  التحليل يظهر زيادة في الطلب على هذه الفئة بنسبة 28% في الشهر الماضي
                </Text>
              </Paper>
              
              <Paper p="md" withBorder>
                <Group gap="sm">
                  <Badge color="red" size="lg" variant="filled">
                    <IconTrendingDown size={14} style={{ marginLeft: 5 }} />
                    تنبيه
                  </Badge>
                  <Text fw={500}>انخفاض مشاهدات فئة "الوثائقي" بنسبة 12%</Text>
                </Group>
                <Text size="xs" c="dimmed" mt={5}>
                  يُنصح بتجديد المحتوى وتحسين الترويج لهذه الفئة
                </Text>
              </Paper>
              
              <Paper p="md" withBorder>
                <Group gap="sm">
                  <Badge color="blue" size="lg" variant="filled">
                    <IconUsers size={14} style={{ marginLeft: 5 }} />
                    سلوك
                  </Badge>
                  <Text fw={500}>المستخدمون يفضلون المشاهدة في الفترة المسائية (7-11 مساءً)</Text>
                </Group>
                <Text size="xs" c="dimmed" mt={5}>
                  يُنصح بجدولة التحديثات والمحتوى الجديد خلال هذه الفترة لزيادة المشاهدات
                </Text>
              </Paper>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );
} 