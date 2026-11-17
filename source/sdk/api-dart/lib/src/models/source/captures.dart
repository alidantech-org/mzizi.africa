import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/addresses.dart';
import 'package:mzizi_api/src/models/source/artifacts.dart';
import 'package:mzizi_api/src/models/source/discoveries.dart';
import 'package:mzizi_api/src/models/source/sources.dart';

part 'captures.g.dart';

/// One retrieval of an address: when, from which link, with what response. Repeated captures never overwrite each other.
@JsonSerializable(includeIfNull: false)
class SourceCaptures {
  const SourceCaptures({
    this.addressId,
    this.artifactId,
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.discoveryId,
    required this.id,
    required this.originalUrl,
    required this.responseMetadata,
    required this.retrievedAt,
    this.retrievedUrl,
    this.sourceId,
    required this.updatedAt,
    required this.version,
  });
  final String? addressId;
  final String? artifactId;
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? discoveryId;
  final String id;
  final String originalUrl;
  final String responseMetadata;
  final DateTime retrievedAt;
  final String? retrievedUrl;
  final String? sourceId;
  final DateTime updatedAt;
  final int version;

  factory SourceCaptures.fromJson(Map<String, dynamic> json) => _$SourceCapturesFromJson(json);

  Map<String, dynamic> toJson() => _$SourceCapturesToJson(this);
}
