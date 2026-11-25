import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/civic/facility_entry.dart';

part 'facility_collection.g.dart';

/// Facility Collection
@JsonSerializable(includeIfNull: false)
class CivicFacilityCollection {
  const CivicFacilityCollection({required this.facilities});
  final List<CivicFacilityEntry> facilities;

  factory CivicFacilityCollection.fromJson(Map<String, dynamic> json) => _$CivicFacilityCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$CivicFacilityCollectionToJson(this);
}
