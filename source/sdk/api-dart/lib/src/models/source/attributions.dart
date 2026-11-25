import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/auth/accounts.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/artifacts.dart';
import 'package:mzizi_api/src/models/source/publishers.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'attributions.g.dart';

/// Credit and rights of an artifact.
@JsonSerializable(includeIfNull: false)
class SourceAttributions {
  const SourceAttributions({
    required this.artifactId,
    required this.assessedAt,
    this.assessorId,
    required this.code,
    required this.createdAt,
    required this.credit,
    this.deletedAt,
    required this.id,
    this.licenceTerm,
    required this.publisherId,
    required this.rights,
    required this.updatedAt,
    required this.version,
  });
  final String artifactId;
  final DateTime assessedAt;
  final String? assessorId;
  final String code;
  final DateTime createdAt;
  final String credit;
  final DateTime? deletedAt;
  final String id;
  final String? licenceTerm;
  final String publisherId;
  final String rights;
  final DateTime updatedAt;
  final int version;

  factory SourceAttributions.fromJson(Map<String, dynamic> json) => _$SourceAttributionsFromJson(json);

  Map<String, dynamic> toJson() => _$SourceAttributionsToJson(this);
}
