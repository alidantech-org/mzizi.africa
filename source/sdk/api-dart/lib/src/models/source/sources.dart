import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/source/source_kind.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/publishers.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'sources.g.dart';

/// A publication channel of a publisher.
@JsonSerializable(includeIfNull: false)
class SourceSources {
  const SourceSources({
    this.classTerm,
    required this.code,
    required this.createdAt,
    this.credentialBinding,
    this.credibilityTerm,
    this.deletedAt,
    required this.id,
    required this.kind,
    required this.label,
    this.licenceTerm,
    required this.publisherId,
    this.termsUrl,
    required this.updatedAt,
    required this.version,
  });
  final String? classTerm;
  final String code;
  final DateTime createdAt;
  final String? credentialBinding;
  final String? credibilityTerm;
  final DateTime? deletedAt;
  final String id;
  final SourceSourceKind kind;
  final String label;
  final String? licenceTerm;
  final String publisherId;
  final String? termsUrl;
  final DateTime updatedAt;
  final int version;

  factory SourceSources.fromJson(Map<String, dynamic> json) => _$SourceSourcesFromJson(json);

  Map<String, dynamic> toJson() => _$SourceSourcesToJson(this);
}
