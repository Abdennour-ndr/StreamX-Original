import { useState, useEffect, useRef } from 'react';
import {
  Paper,
  TextInput,
  Button,
  Stack,
  Text,
  Avatar,
  Group,
  ScrollArea,
  Loader,
  Box,
} from '@mantine/core';
import { IconSend, IconRobot, IconUser } from '@tabler/icons-react';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

const INITIAL_MESSAGE = `مرحباً! 👋 أنا صديقك في عالم الترفيه! يسعدني أن أساعدك في اكتشاف أفضل الأفلام والمسلسلات.

يمكنك أن تخبرني عن:
• مزاجك الحالي 😊
• نوع المحتوى المفضل لديك 🎬
• أو حتى تجربة مشاهدة سابقة أعجبتك ⭐

وسأقترح عليك محتوى يناسبك تماماً! ما رأيك أن نبدأ؟`;

export function ContentChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: INITIAL_MESSAGE
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('Component mounted');
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const generatePrompt = (userMessage: string, conversationHistory: Message[]) => {
    console.log('Generating prompt for:', userMessage);
    return `أنت مساعد ودود ومتحمس لمساعدة المستخدم في اختيار المحتوى الترفيهي. عليك أن تكون صديقاً محادثاً وتظهر اهتماماً بذوق المستخدم وتجاربه.

سياق المحادثة السابقة:
${conversationHistory.map(msg => `${msg.role === 'user' ? 'المستخدم' : 'المساعد'}: ${msg.content}`).join('\n')}

رسالة المستخدم الحالية:
${userMessage}

قم بالرد بأسلوب ودي وشخصي، مع:
1. إظهار التفاعل مع مشاعر المستخدم وذوقه
2. تقديم اقتراحات مخصصة بناءً على المحادثة
3. طرح أسئلة متابعة لفهم تفضيلاته بشكل أفضل
4. مشاركة معلومات مثيرة للاهتمام عن المحتوى المقترح
5. استخدام الرموز التعبيرية بشكل معتدل لجعل المحادثة أكثر حيوية

الرد يجب أن يكون باللغة العربية.`;
  };

  const handleSend = async () => {
    console.log('Send button clicked');
    if (!input.trim()) {
      console.log('Empty input, returning');
      return;
    }

    const userMessage = input.trim();
    console.log('Sending message:', userMessage);
    
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      console.log('Making API request...');
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: generatePrompt(userMessage, messages),
        }),
      });

      console.log('API response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error:', errorData);
        throw new Error(errorData.error || errorData.details || 'فشل الاتصال بالخادم');
      }

      const data = await response.json();
      console.log('API response data:', data);

      if (!data.response) {
        throw new Error('لا يوجد رد من الخادم');
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error in handleSend:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `عذراً، حدث خطأ: ${error instanceof Error ? error.message : 'فشل الاتصال بالخادم'}\n\nيمكنك المحاولة مرة أخرى لاحقاً.`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper 
      className="custom-paper" 
      p="md" 
      radius="lg"
      style={{ maxWidth: '100%', width: '800px', margin: '0 auto' }}
    >
      <Stack gap="md">
        <ScrollArea h={400} type="scroll" viewportRef={scrollAreaRef}>
          <Stack gap="sm">
            {messages.map((message, index) => (
              <Group 
                key={index} 
                align="flex-start"
                justify={message.role === 'user' ? 'flex-end' : 'flex-start'}
                style={{ marginBottom: 12 }}
              >
                {message.role === 'assistant' && (
                  <Avatar color="blue" radius="xl">
                    <IconRobot size={24} />
                  </Avatar>
                )}
                <Box
                  className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
                  style={{
                    maxWidth: '70%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: message.role === 'user' ? 'linear-gradient(45deg, #3b82f6, #06b6d4)' : 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Text size="sm" style={{ whiteSpace: 'pre-line' }}>
                    {message.content}
                  </Text>
                </Box>
                {message.role === 'user' && (
                  <Avatar color="blue" radius="xl">
                    <IconUser size={24} />
                  </Avatar>
                )}
              </Group>
            ))}
            {isLoading && (
              <Group align="flex-start">
                <Avatar color="blue" radius="xl">
                  <IconRobot size={24} />
                </Avatar>
                <Loader size="sm" color="blue" />
              </Group>
            )}
          </Stack>
        </ScrollArea>
        
        <Group gap="sm">
          <TextInput
            placeholder="أخبرني عن ذوقك في المشاهدة أو مزاجك الحالي..."
            value={input}
            onChange={(e) => {
              console.log('Input changed:', e.target.value);
              setInput(e.target.value);
            }}
            onKeyPress={(e) => {
              console.log('Key pressed:', e.key);
              if (e.key === 'Enter' && !e.shiftKey) {
                handleSend();
              }
            }}
            style={{ flex: 1 }}
            disabled={isLoading}
            size="md"
          />
          <Button 
            onClick={handleSend}
            disabled={isLoading}
            variant="gradient"
            gradient={{ from: '#3b82f6', to: '#06b6d4' }}
            size="md"
          >
            <IconSend size={18} />
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
} 