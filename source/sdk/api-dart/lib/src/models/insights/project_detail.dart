import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/project_detail_evidence.dart';
import 'package:mzizi_api/src/models/insights/project_detail_media.dart';
import 'package:mzizi_api/src/models/insights/project_detail_procurement.dart';
import 'package:mzizi_api/src/models/insights/project_detail_project.dart';

part 'project_detail.g.dart';

/// Project Detail
@JsonSerializable(includeIfNull: false)
class InsightsProjectDetail {
  const InsightsProjectDetail({
    required this.evidence,
    required this.gaps,
    required this.media,
    required this.money,
    required this.procurement,
    required this.project,
  });
  final List<InsightsProjectDetailEvidence> evidence;
  final List<String> gaps;
  final List<InsightsProjectDetailMedia> media;
  final List<Object?> money;
  final InsightsProjectDetailProcurement procurement;
  final InsightsProjectDetailProject project;

  factory InsightsProjectDetail.fromJson(Map<String, dynamic> json) => _$InsightsProjectDetailFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsProjectDetailToJson(this);
}
