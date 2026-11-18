import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/experience/class_count.dart';
import 'package:mzizi_api/src/models/experience/facility_row.dart';

part 'facility_list.g.dart';

/// Facility List
@JsonSerializable(includeIfNull: false)
class ExperienceFacilityList {
  const ExperienceFacilityList({required this.classes, required this.facilities, required this.gaps, required this.total});
  final List<ExperienceClassCount> classes;
  final List<ExperienceFacilityRow> facilities;
  final List<String> gaps;
  final int total;

  factory ExperienceFacilityList.fromJson(Map<String, dynamic> json) => _$ExperienceFacilityListFromJson(json);

  Map<String, dynamic> toJson() => _$ExperienceFacilityListToJson(this);
}
