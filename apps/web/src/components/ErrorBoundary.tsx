import { Component, ErrorInfo, ReactNode } from 'react';
import { useLanguage } from '../hooks/useLanguage';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundaryComponent extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <ErrorDisplay error={this.state.error} />;
    }

    return this.props.children;
  }
}

function ErrorDisplay({ error }: { error?: Error }) {
  const { t } = useLanguage();

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='max-w-md w-full bg-white shadow-lg rounded-lg p-6'>
        <div className='flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full'>
          <svg
            className='w-6 h-6 text-red-600'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
            />
          </svg>
        </div>
        <div className='mt-4 text-center'>
          <h3 className='text-lg font-medium text-gray-900'>
            {t('api.somethingWentWrong')}
          </h3>
          <p className='mt-2 text-sm text-gray-500'>
            {t('api.somethingWentWrongDescription')}
          </p>
          {process.env.NODE_ENV === 'development' && error && (
            <details className='mt-4 text-left'>
              <summary className='cursor-pointer text-sm font-medium text-gray-700'>
                {t('api.errorDetails')}
              </summary>
              <pre className='mt-2 text-xs text-gray-600 bg-gray-100 p-2 rounded overflow-auto'>
                {error.toString()}
              </pre>
            </details>
          )}
          <div className='mt-4'>
            <button
              onClick={() => window.location.reload()}
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            >
              {t('api.refreshPage')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary(props: Props) {
  return <ErrorBoundaryComponent {...props} />;
}
