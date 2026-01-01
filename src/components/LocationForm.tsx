import { useBudget } from '../context/BudgetContext';
import { US_STATES } from '../constants/categories';

export function LocationForm() {
  const { state, dispatch } = useBudget();
  const { location } = state;

  return (
    <div className="form-card">
      <div className="absolute top-0 right-0 w-32 h-32 pattern-chevron opacity-10"></div>
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-6 h-6 bg-mcm-mustard clip-path-hexagon"></div>
        <h2 className="text-2xl font-display font-bold text-mcm-charcoal dark:text-mcm-cream uppercase tracking-tight">
          Location & Tax Context
        </h2>
      </div>

      <div className="space-y-4 relative z-10">
        <div>
          <label className="label-retro">
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
            className="input-retro w-full opacity-60 cursor-not-allowed"
            disabled
          />
          <p className="text-xs text-mcm-slate dark:text-mcm-cream/70 mt-2">
            Currently only United States is supported
          </p>
        </div>

        <div>
          <label className="label-retro">
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
            className="select-retro w-full"
          >
            {US_STATES.map((state) => (
              <option key={state.code} value={state.code}>
                {state.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-mcm-slate dark:text-mcm-cream/70 mt-2">
            State income tax will be calculated based on your selection
          </p>
        </div>

        <div>
          <label className="label-retro">
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
            className="input-retro w-full"
          />
          <p className="text-xs text-mcm-slate dark:text-mcm-cream/70 mt-2">
            Local taxes are not currently calculated
          </p>
        </div>
      </div>
    </div>
  );
}
