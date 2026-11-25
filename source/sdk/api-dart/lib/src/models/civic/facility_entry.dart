import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/civic/facility_entry_names.dart';

part 'facility_entry.g.dart';

/// Facility Entry
@JsonSerializable(includeIfNull: false)
class CivicFacilityEntry {
  const CivicFacilityEntry({
    required this.classTerm,
    required this.code,
    required this.facilityId,
    required this.names,
    this.ownershipTerm,
    this.statusTerm,
  });
  final String classTerm;
  final String code;
  final String facilityId;
  final List<CivicFacilityEntryNames> names;
  final String? ownershipTerm;
  final String? statusTerm;

  factory CivicFacilityEntry.fromJson(Map<String, dynamic> json) => _$CivicFacilityEntryFromJson(json);

  Map<String, dynamic> toJson() => _$CivicFacilityEntryToJson(this);
}
