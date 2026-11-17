import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/filesystem/file_versions.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/publishers.dart';

part 'attributions.g.dart';

/// Accepted rights and credit statement tied to exact content and publisher.
@JsonSerializable(includeIfNull: false)
class SourceAttributions {
  const SourceAttributions({
    required this.assessedAt,
    required this.assessorSnapshot,
    required this.code,
    required this.createdAt,
    required this.credit,
    this.deletedAt,
    required this.fileVersionId,
    required this.id,
    this.licenseValueId,
    required this.publisherId,
    required this.rightsStatement,
    required this.updatedAt,
    required this.version,
  });
  final DateTime assessedAt;
  final String assessorSnapshot;
  final String code;
  final DateTime createdAt;
  final String credit;
  final DateTime? deletedAt;
  final String fileVersionId;
  final String id;
  final String? licenseValueId;
  final String publisherId;
  final String rightsStatement;
  final DateTime updatedAt;
  final int version;

  factory SourceAttributions.fromJson(Map<String, dynamic> json) => _$SourceAttributionsFromJson(json);

  Map<String, dynamic> toJson() => _$SourceAttributionsToJson(this);
}
