import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/source/source_kind.dart';
import 'package:mzizi_api/src/models/official/entities.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/publishers.dart';

part 'sources.g.dart';

/// A publication channel: a real website or a real API, with its classification and credibility.
@JsonSerializable(includeIfNull: false)
class SourceSources {
  const SourceSources({
    this.classificationId,
    required this.code,
    required this.createdAt,
    this.credentialBinding,
    this.credibilityId,
    this.deletedAt,
    this.description,
    required this.id,
    required this.kind,
    this.licenceId,
    this.officialEntityId,
    required this.publisherId,
    this.termsUrl,
    required this.title,
    required this.updatedAt,
    required this.version,
  });
  final String? classificationId;
  final String code;
  final DateTime createdAt;
  final String? credentialBinding;
  final String? credibilityId;
  final DateTime? deletedAt;
  final String? description;
  final String id;
  final SourceSourceKind kind;
  final String? licenceId;
  final String? officialEntityId;
  final String publisherId;
  final String? termsUrl;
  final String title;
  final DateTime updatedAt;
  final int version;

  factory SourceSources.fromJson(Map<String, dynamic> json) => _$SourceSourcesFromJson(json);

  Map<String, dynamic> toJson() => _$SourceSourcesToJson(this);
}
