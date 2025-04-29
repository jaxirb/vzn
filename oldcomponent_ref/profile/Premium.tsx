import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type PremiumFeature = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

type SubscriptionPlan = {
  id: string;
  title: string;
  price: number;
  interval: 'month' | 'year';
  savings?: number;
  isPopular?: boolean;
};

type PremiumProps = {
  features: PremiumFeature[];
  plans: SubscriptionPlan[];
  onSelectPlan: (plan: SubscriptionPlan) => void;
};

export default function Premium({ features, plans, onSelectPlan }: PremiumProps) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="crown" size={32} color="#FFD700" />
        <Text style={styles.title}>Upgrade to Pro</Text>
        <Text style={styles.subtitle}>
          Unlock all features and maximize your productivity
        </Text>
      </View>

      {/* Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PRO FEATURES</Text>
        <View style={styles.featuresList}>
          {features.map((feature) => (
            <View key={feature.id} style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <MaterialCommunityIcons
                  name={feature.icon as any}
                  size={24}
                  color="#6366F1"
                />
              </View>
              <View style={styles.featureInfo}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Subscription Plans */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CHOOSE YOUR PLAN</Text>
        <View style={styles.plansList}>
          {plans.map((plan) => (
            <Pressable
              key={plan.id}
              style={[styles.planCard, plan.isPopular && styles.popularPlan]}
              onPress={() => onSelectPlan(plan)}
            >
              {plan.isPopular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>MOST POPULAR</Text>
                </View>
              )}
              
              <View style={styles.planHeader}>
                <Text style={styles.planTitle}>{plan.title}</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.currency}>$</Text>
                  <Text style={styles.price}>{plan.price}</Text>
                  <Text style={styles.interval}>
                    /{plan.interval}
                  </Text>
                </View>
              </View>

              {plan.savings && (
                <View style={styles.savingsBadge}>
                  <Text style={styles.savingsText}>
                    Save {plan.savings}%
                  </Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 16,
  },
  featuresList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2F2F2F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  plansList: {
    gap: 16,
  },
  planCard: {
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  popularPlan: {
    borderColor: '#6366F1',
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    right: 16,
    backgroundColor: '#6366F1',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  planHeader: {
    alignItems: 'center',
    gap: 8,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currency: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  price: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  interval: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  savingsBadge: {
    backgroundColor: '#065F46',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 12,
  },
  savingsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#34D399',
  },
}); 