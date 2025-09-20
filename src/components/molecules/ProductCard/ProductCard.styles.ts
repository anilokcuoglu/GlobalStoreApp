import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  image: {
    borderRadius: 8,
    resizeMode: 'contain',
  },
  content: {
    padding: 16,
    paddingTop: 12,
  },
  category: {
    color: '#007AFF',
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 8,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 2,
  },
});

