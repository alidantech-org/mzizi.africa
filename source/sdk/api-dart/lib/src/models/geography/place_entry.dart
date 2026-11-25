import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/identity_kind.dart';
import 'package:mzizi_api/src/models/geography/place_entry_names.dart';

part 'place_entry.g.dart';

/// Place Entry
@JsonSerializable(includeIfNull: false)
class GeographyPlaceEntry {
  const GeographyPlaceEntry({
    required this.code,
    required this.featureId,
    this.fromYear,
    required this.identityKind,
    required this.kindTerm,
    required this.names,
    this.toYear,
  });
  final String code;
  final String featureId;
  final int? fromYear;
  final SharedIdentityKind identityKind;
  final String kindTerm;
  final List<GeographyPlaceEntryNames> names;
  final int? toYear;

  factory GeographyPlaceEntry.fromJson(Map<String, dynamic> json) => _$GeographyPlaceEntryFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyPlaceEntryToJson(this);
}
