import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/civic/projects.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'project_features.g.dart';

/// One typed relationship between a Civic project and one Geography feature.
@JsonSerializable(includeIfNull: false)
class CivicProjectFeatures {
  const CivicProjectFeatures({
    required this.createdAt,
    this.deletedAt,
    required this.featureId,
    required this.featureKindId,
    required this.id,
    required this.projectId,
    this.sourceCitationId,
    required this.updatedAt,
    required this.version,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String featureId;
  final String featureKindId;
  final String id;
  final String projectId;
  final String? sourceCitationId;
  final DateTime updatedAt;
  final int version;

  factory CivicProjectFeatures.fromJson(Map<String, dynamic> json) => _$CivicProjectFeaturesFromJson(json);

  Map<String, dynamic> toJson() => _$CivicProjectFeaturesToJson(this);
}
