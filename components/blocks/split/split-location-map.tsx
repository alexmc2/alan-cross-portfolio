// components/blocks/split/split-location-map.tsx
import LocationMap from "@/components/blocks/location/location-map";
import type { PAGE_QUERYResult } from "@/sanity.types";

type Block = NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number];
type SplitRow = Extract<Block, { _type: "split-row" }>;
type SplitLocationMapColumn = Extract<
  NonNullable<SplitRow["splitColumns"]>[number],
  { _type: "split-location-map" }
>;

export default function SplitLocationMap(column: SplitLocationMapColumn) {
  return (
    <LocationMap
      _type="location-map"
      _key={column._key}
      heading={column.heading}
      headingAlignment={column.headingAlignment}
      locationLabel={column.locationLabel}
      locationName={column.locationName}
      address={column.address}
      latitude={column.latitude}
      longitude={column.longitude}
      mapZoom={column.mapZoom}
      padding={null}
      colorVariant={null}
      layout="inline"
    />
  );
}
