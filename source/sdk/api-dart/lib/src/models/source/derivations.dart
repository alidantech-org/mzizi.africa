import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/filesystem/versions.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/artifacts.dart';
import 'package:mzizi_api/src/models/source/editions.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'derivations.g.dart';

/// Lineage: which artifact, edition or file version was made from which.
@JsonSerializable(includeIfNull: false)
class SourceDerivations {
  const SourceDerivations({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    this.inputArtifactId,
    this.inputEditionId,
    this.inputVersionId,
    required this.kindTerm,
    this.method,
    this.outputArtifactId,
    this.outputEditionId,
    this.outputVersionId,
    this.run,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String? inputArtifactId;
  final String? inputEditionId;
  final String? inputVersionId;
  final String kindTerm;
  final String? method;
  final String? outputArtifactId;
  final String? outputEditionId;
  final String? outputVersionId;
  final String? run;
  final DateTime updatedAt;
  final int version;

  factory SourceDerivations.fromJson(Map<String, dynamic> json) => _$SourceDerivationsFromJson(json);

  Map<String, dynamic> toJson() => _$SourceDerivationsToJson(this);
}
