import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/experience/facility_row.dart';
import 'package:mzizi_api/src/models/experience/hosted_station.dart';
import 'package:mzizi_api/src/models/experience/place_ref.dart';

part 'facility_detail.g.dart';

/// Facility Detail
@JsonSerializable(includeIfNull: false)
class ExperienceFacilityDetail {
  const ExperienceFacilityDetail({required this.chain, required this.facility, required this.gaps, required this.stations});
  final List<ExperiencePlaceRef> chain;
  final ExperienceFacilityRow facility;
  final List<String> gaps;
  final List<ExperienceHostedStation> stations;

  factory ExperienceFacilityDetail.fromJson(Map<String, dynamic> json) => _$ExperienceFacilityDetailFromJson(json);

  Map<String, dynamic> toJson() => _$ExperienceFacilityDetailToJson(this);
}
