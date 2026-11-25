import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/page_window.dart';

part 'place_projects.g.dart';

/// Place Projects
@JsonSerializable(includeIfNull: false)
class CivicPlaceProjects {
  const CivicPlaceProjects({required this.featureId, this.limit, this.offset});
  final String featureId;
  final int? limit;
  final int? offset;

  factory CivicPlaceProjects.fromJson(Map<String, dynamic> json) => _$CivicPlaceProjectsFromJson(json);

  Map<String, dynamic> toJson() => _$CivicPlaceProjectsToJson(this);
}
