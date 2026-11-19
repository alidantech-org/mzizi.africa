/** Place finance loads during server rendering through the generated SDK. */
import { getPlaceCivic } from "@mzizi/api-client/actions/insights/get-place-civic.actions.ts";
import { Loaded } from "#/_archives/components/site/loaded";
import PlaceFinanceView from "#/_archives/components/site/views/place-finance-view";

export default function PlaceFinance({ id }: { id: string }) {
  return (
    <Loaded
      read={async () => {
        const result = await getPlaceCivic({ params: { featureId: id } });
        if (!result.success || !result.body)
          throw new Error("The place finance document could not be loaded.");
        return result.body;
      }}
    >
      {(data) => <PlaceFinanceView data={data} />}
    </Loaded>
  );
}
