import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/source/address_kind.dart';
import 'package:mzizi_api/src/enums/source/http_method.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/domains.dart';

part 'addresses.g.dart';

/// A page, listing, file or API endpoint on a domain, distinguished by method, path and query.
@JsonSerializable(includeIfNull: false)
class SourceAddresses {
  const SourceAddresses({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.domainId,
    required this.id,
    required this.kind,
    required this.method,
    this.note,
    required this.path,
    required this.query,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String domainId;
  final String id;
  final SourceAddressKind kind;
  final SourceHttpMethod method;
  final String? note;
  final String path;
  final String query;
  final DateTime updatedAt;
  final int version;

  factory SourceAddresses.fromJson(Map<String, dynamic> json) => _$SourceAddressesFromJson(json);

  Map<String, dynamic> toJson() => _$SourceAddressesToJson(this);
}
