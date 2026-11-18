import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/experience/fact_row.dart';

part 'fact_list.g.dart';

/// Fact List
@JsonSerializable(includeIfNull: false)
class ExperienceFactList {
  const ExperienceFactList({required this.facts, required this.gaps});
  final List<ExperienceFactRow> facts;
  final List<String> gaps;

  factory ExperienceFactList.fromJson(Map<String, dynamic> json) => _$ExperienceFactListFromJson(json);

  Map<String, dynamic> toJson() => _$ExperienceFactListToJson(this);
}
