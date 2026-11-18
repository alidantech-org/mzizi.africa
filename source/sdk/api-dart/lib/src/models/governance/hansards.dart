import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/governance/sittings.dart';
import 'package:mzizi_api/src/models/reference/language.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/artifacts.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'hansards.g.dart';

/// The official verbatim record (Hansard) of one sitting as a published document. Speeches and divisions are extracted from it and cite its pages.
@JsonSerializable(includeIfNull: false)
class GovernanceHansards {
  const GovernanceHansards({
    required this.artifactId,
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.isProvisional,
    required this.languageId,
    this.publishedOn,
    this.reference,
    required this.sittingId,
    this.sourceCitationId,
    required this.updatedAt,
    required this.version,
  });
  final String artifactId;
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final bool isProvisional;
  final String languageId;
  final DateTime? publishedOn;
  final String? reference;
  final String sittingId;
  final String? sourceCitationId;
  final DateTime updatedAt;
  final int version;

  factory GovernanceHansards.fromJson(Map<String, dynamic> json) => _$GovernanceHansardsFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceHansardsToJson(this);
}
