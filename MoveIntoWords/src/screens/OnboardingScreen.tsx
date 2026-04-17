import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Colors, Typography, Spacing, Radii, FontFamily } from '../constants/Theme';
import Button from '../components/Button';
import OnboardingSlide1 from '../components/OnboardingSlide1';
import OnboardingSlide2 from '../components/OnboardingSlide2';
import OnboardingSlide3 from '../components/OnboardingSlide3';
import OnboardingSlide4 from '../components/OnboardingSlide4';

interface SlideData {
  id: string;
  pill: string;
  title: string;
  description: string;
  Component: React.FC;
}

const SLIDES: SlideData[] = [
  {
    id: '1',
    pill: '18 Guided Modules',
    title: 'Find Your Starting Point',
    description: 'Every journey begins with one honest question. Yours starts here.',
    Component: OnboardingSlide1,
  },
  {
    id: '2',
    pill: 'AI-Guided Prompts',
    title: 'Words Will Find You',
    description: 'No blank pages. No pressure. Just the right question at the right moment.',
    Component: OnboardingSlide2,
  },
  {
    id: '3',
    pill: 'Your Progress',
    title: "See How Far You've Come",
    description: 'Growth is quiet — until you look back and realize how much has changed.',
    Component: OnboardingSlide3,
  },
  {
    id: '4',
    pill: 'Community + Movement',
    title: "You're Not Walking This Alone",
    description: 'A community moving forward with you — on the page and in the world.',
    Component: OnboardingSlide4,
  },
];

interface Props {
  onFinish?: () => void;
}

const OnboardingScreen: React.FC<Props> = ({ onFinish }) => {
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<SlideData>>(null);

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const handleGetStarted = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      onFinish?.();
    }
  };

  const renderItem = ({ item }: { item: SlideData }) => {
    const Content = item.Component;
    return (
      <View style={[styles.slide, { width }]}>
        <View style={styles.headerArea}>
          <View style={styles.pillContainer}>
            <Text style={styles.pillText}>{item.pill}</Text>
          </View>
          <Text style={styles.title}>{item.title}</Text>
        </View>

        <View style={styles.contentArea}>
          <Content />
        </View>

        <View style={styles.footerArea}>
          <View style={styles.pagination}>
            {SLIDES.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, currentIndex === i ? styles.dotActive : styles.dotInactive]}
              />
            ))}
          </View>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
      />
      <View style={styles.buttonWrapper}>
        <Button label="Get Started" onPress={handleGetStarted} />
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  slide: {
    flex: 1,
    paddingTop: Spacing.xxl + Spacing.xl,
  },
  headerArea: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  pillContainer: {
    backgroundColor: Colors.primaryDark,
    paddingVertical: Spacing.xxs + 2,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radii.full,
    marginBottom: Spacing.lg,
  },
  pillText: {
    ...Typography.caption,
    color: Colors.white,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontFamily: FontFamily.serif,
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    textTransform: 'uppercase',
    lineHeight: 36,
  },
  contentArea: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  footerArea: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  pagination: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.lg + Spacing.md,
  },
  dot: {
    height: Spacing.xxs,
    width: Spacing.xxl - Spacing.md,
    borderRadius: 2,
  },
  dotActive: {
    backgroundColor: Colors.primaryDark,
  },
  dotInactive: {
    backgroundColor: Colors.dotInactive,
  },
  description: {
    ...Typography.body,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  buttonWrapper: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    paddingTop: Spacing.xs,
  },
});
