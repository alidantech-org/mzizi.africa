import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/artifacts.dart';
import 'package:mzizi_api/src/models/source/publishers.dart';

part 'attributions.g.dart';

/// Credit and rights for one artifact and publisher; equal bytes from other places never overwrite it.
@JsonSerializable(includeIfNull: false)
class SourceAttributions {
  const SourceAttributions({
    required this.artifactId,
    required this.assessedAt,
    required this.assessorSnapshot,
    required this.code,
    required this.createdAt,
    required this.credit,
    this.deletedAt,
    required this.id,
    this.licenseValueId,
    required this.publisherId,
    required this.rightsStatement,
    required this.updatedAt,
    required this.version,
  });
  final String artifactId;
  final DateTime assessedAt;
  final String assessorSnapshot;
  final String code;
  final DateTime createdAt;
  final String credit;
  final DateTime? deletedAt;
  final String id;
  final String? licenseValueId;
  final String publisherId;
  final String rightsStatement;
  final DateTime updatedAt;
  final int version;

  factory SourceAttributions.fromJson(Map<String, dynamic> json) => _$SourceAttributionsFromJson(json);

  Map<String, dynamic> toJson() => _$SourceAttributionsToJson(this);
}
