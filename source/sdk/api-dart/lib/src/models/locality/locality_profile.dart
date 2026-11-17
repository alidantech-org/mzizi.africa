import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/locality/locality_unit.dart';
import 'package:mzizi_api/src/models/locality/media_ref.dart';
import 'package:mzizi_api/src/models/locality/office_holder.dart';
import 'package:mzizi_api/src/models/locality/procurement_summary.dart';

part 'locality_profile.g.dart';

/// Locality Profile
@JsonSerializable(includeIfNull: false)
class LocalityLocalityProfile {
  const LocalityLocalityProfile({
    required this.chain,
    required this.gaps,
    this.languageRequested,
    required this.languageServed,
    required this.media,
    required this.officials,
    required this.place,
    required this.procurement,
  });
  final List<LocalityLocalityUnit> chain;
  final List<String> gaps;
  final String? languageRequested;
  final String languageServed;
  final List<LocalityMediaRef> media;
  final List<LocalityOfficeHolder> officials;
  final LocalityLocalityUnit place;
  final LocalityProcurementSummary procurement;

  factory LocalityLocalityProfile.fromJson(Map<String, dynamic> json) => _$LocalityLocalityProfileFromJson(json);

  Map<String, dynamic> toJson() => _$LocalityLocalityProfileToJson(this);
}
