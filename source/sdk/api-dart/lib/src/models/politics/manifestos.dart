import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/election/candidates.dart';
import 'package:mzizi_api/src/models/election/elections.dart';
import 'package:mzizi_api/src/models/filesystem/versions.dart';
import 'package:mzizi_api/src/models/politics/parties.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';

part 'manifestos.g.dart';

/// A party's or candidate's manifesto for an election.
@JsonSerializable(includeIfNull: false)
class PoliticsManifestos {
  const PoliticsManifestos({
    this.artifactId,
    this.candidateId,
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.electionId,
    required this.id,
    this.partyId,
    this.publishedOn,
    required this.updatedAt,
    required this.version,
  });
  final String? artifactId;
  final String? candidateId;
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? electionId;
  final String id;
  final String? partyId;
  final DateTime? publishedOn;
  final DateTime updatedAt;
  final int version;

  factory PoliticsManifestos.fromJson(Map<String, dynamic> json) => _$PoliticsManifestosFromJson(json);

  Map<String, dynamic> toJson() => _$PoliticsManifestosToJson(this);
}
