import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/legislature/hansard_status.dart';
import 'package:mzizi_api/src/models/filesystem/versions.dart';
import 'package:mzizi_api/src/models/legislature/sittings.dart';
import 'package:mzizi_api/src/models/reference/languages.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';

part 'hansards.g.dart';

/// The official record of a sitting.
@JsonSerializable(includeIfNull: false)
class LegislatureHansards {
  const LegislatureHansards({
    this.artifactId,
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.languageId,
    this.publishedOn,
    this.reference,
    required this.sittingId,
    required this.status,
    required this.updatedAt,
    required this.version,
  });
  final String? artifactId;
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String languageId;
  final DateTime? publishedOn;
  final String? reference;
  final String sittingId;
  final LegislatureHansardStatus status;
  final DateTime updatedAt;
  final int version;

  factory LegislatureHansards.fromJson(Map<String, dynamic> json) => _$LegislatureHansardsFromJson(json);

  Map<String, dynamic> toJson() => _$LegislatureHansardsToJson(this);
}
