import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/source/source_kind.dart';
import 'package:mzizi_api/src/models/official/entities.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/publishers.dart';

part 'sources.g.dart';

/// A publication channel, named by anything but its domain: a real website, a real API, or a dataset (files or data obtained from somewhere that is neither). Only websites and APIs have domains and paths; the dataset tables record what we prepared from sources.
@JsonSerializable(includeIfNull: false)
class SourceSources {
  const SourceSources({
    required this.code,
    required this.createdAt,
    this.credentialBinding,
    this.deletedAt,
    this.description,
    required this.id,
    required this.kind,
    this.officialEntityId,
    required this.publisherId,
    required this.title,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final String? credentialBinding;
  final DateTime? deletedAt;
  final String? description;
  final String id;
  final SourceSourceKind kind;
  final String? officialEntityId;
  final String publisherId;
  final String title;
  final DateTime updatedAt;
  final int version;

  factory SourceSources.fromJson(Map<String, dynamic> json) => _$SourceSourcesFromJson(json);

  Map<String, dynamic> toJson() => _$SourceSourcesToJson(this);
}
