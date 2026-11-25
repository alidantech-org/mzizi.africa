import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/election/elections.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/reference/languages.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'stations.g.dart';

/// A polling station in an election.
@JsonSerializable(includeIfNull: false)
class ElectionStations {
  const ElectionStations({
    this.closesAt,
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.electionId,
    required this.featureId,
    this.hostId,
    required this.id,
    this.note,
    this.noteLanguageId,
    this.opensAt,
    this.registeredVoters,
    this.statusTerm,
    this.streams,
    required this.updatedAt,
    required this.version,
  });
  final DateTime? closesAt;
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String electionId;
  final String featureId;
  final String? hostId;
  final String id;
  final String? note;
  final String? noteLanguageId;
  final DateTime? opensAt;
  final int? registeredVoters;
  final String? statusTerm;
  final int? streams;
  final DateTime updatedAt;
  final int version;

  factory ElectionStations.fromJson(Map<String, dynamic> json) => _$ElectionStationsFromJson(json);

  Map<String, dynamic> toJson() => _$ElectionStationsToJson(this);
}
