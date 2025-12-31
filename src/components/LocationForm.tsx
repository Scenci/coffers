import { useBudget } from '../context/BudgetContext';
import { US_STATES } from '../constants/categories';

export function LocationForm() {
  const { state, dispatch } = useBudget();
  const { location } = state;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Location & Tax Context
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Country
          </label>
          <input
            type="text"
            value={location.country}
            onChange={(e) =>
              dispatch({
                type: 'SET_LOCATION',
                payload: { country: e.target.value },
              })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            disabled
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Currently only United States is supported
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            State
          </label>
          <select
            value={location.state}
            onChange={(e) =>
              dispatch({
                type: 'SET_LOCATION',
                payload: { state: e.target.value },
              })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          >
            {US_STATES.map((state) => (
              <option key={state.code} value={state.code}>
                {state.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            State income tax will be calculated based on your selection
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            City (Optional)
          </label>
          <input
            type="text"
            value={location.city || ''}
            onChange={(e) =>
              dispatch({
                type: 'SET_LOCATION',
                payload: { city: e.target.value },
              })
            }
            placeholder="Enter your city"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Local taxes are not currently calculated
          </p>
        </div>
      </div>
    </div>
  );
}
