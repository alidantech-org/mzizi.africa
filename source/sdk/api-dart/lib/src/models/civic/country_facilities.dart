import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/page_window.dart';

part 'country_facilities.g.dart';

/// Country Facilities
@JsonSerializable(includeIfNull: false)
class CivicCountryFacilities {
  const CivicCountryFacilities({this.classTerm, required this.countryId, this.limit, this.offset});
  final String? classTerm;
  final String countryId;
  final int? limit;
  final int? offset;

  factory CivicCountryFacilities.fromJson(Map<String, dynamic> json) => _$CivicCountryFacilitiesFromJson(json);

  Map<String, dynamic> toJson() => _$CivicCountryFacilitiesToJson(this);
}
