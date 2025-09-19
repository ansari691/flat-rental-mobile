import { StyleSheet, Platform, StatusBar } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFBFC',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  appTitle: {
    fontSize: 40,
    fontFamily: 'Nunito_700Bold',
    color: '#0B2545',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6D7D9C',
    marginBottom: 32,
    textAlign: 'center',
    fontFamily: 'Nunito_400Regular',
  },
  errorText: {
    color: '#A94A4A',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 12,
    fontWeight: '500',
    fontFamily: 'Nunito_400Regular',
  },
  errorBorder: {
    borderColor: '#A94A4A',
  },
  inputStyle: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    borderWidth: 1,
    paddingHorizontal: 15,
    width: '100%',
    borderRadius: 5,
    backgroundColor: '#F4F4F4',
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#A4C3B2',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  buttonText: {
    fontFamily: 'Nunito_500Medium',
    fontSize: 14,
    color: '#1C3738',
  },
  altAuthOption: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },

  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#A4C3B2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  radioDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#A4C3B2',
  },

  radioLabel: {
    fontSize: 16,
    color: '#333',
    textTransform: 'capitalize',
  },
});

export default styles;
