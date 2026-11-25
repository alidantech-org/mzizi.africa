import 'package:json_annotation/json_annotation.dart';

part 'project_detail_sites.g.dart';

/// Project Detail Sites
@JsonSerializable(includeIfNull: false)
class CivicProjectDetailSites {
  const CivicProjectDetailSites({required this.featureId, required this.kindTerm});
  final String featureId;
  final String kindTerm;

  factory CivicProjectDetailSites.fromJson(Map<String, dynamic> json) => _$CivicProjectDetailSitesFromJson(json);

  Map<String, dynamic> toJson() => _$CivicProjectDetailSitesToJson(this);
}
